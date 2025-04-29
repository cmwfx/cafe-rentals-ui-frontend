
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface User {
  id: string;
  email: string;
  display_name: string | null;
  credit_balance: number;
}

const UsersTable = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [creditAmounts, setCreditAmounts] = useState<{ [key: string]: string }>({});
  const [addingCredit, setAddingCredit] = useState<{ [key: string]: boolean }>({});
  const { toast } = useToast();

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredUsers(users);
    } else {
      setFilteredUsers(
        users.filter(user => 
          user.email.toLowerCase().includes(searchQuery.toLowerCase())
        )
      );
    }
  }, [searchQuery, users]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      
      // We need to join profiles and users to get both email and profile data
      const { data, error } = await supabase
        .from('profiles')
        .select(`
          id,
          display_name,
          credit_balance,
          user:id (
            email
          )
        `);

      if (error) {
        throw error;
      }

      if (data) {
        // Transform data to match our User interface
        const formattedUsers = data.map(item => ({
          id: item.id,
          email: item.user?.email || 'No email',
          display_name: item.display_name,
          credit_balance: item.credit_balance
        }));
        
        setUsers(formattedUsers);
        setFilteredUsers(formattedUsers);
        
        // Initialize credit amounts for each user
        const initialCreditAmounts: { [key: string]: string } = {};
        formattedUsers.forEach(user => {
          initialCreditAmounts[user.id] = "";
        });
        setCreditAmounts(initialCreditAmounts);
      }
    } catch (error) {
      console.error("Error fetching users:", error);
      toast({
        title: "Error",
        description: "Failed to fetch users",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCreditAmountChange = (userId: string, amount: string) => {
    setCreditAmounts(prev => ({
      ...prev,
      [userId]: amount
    }));
  };

  const handleAddCredit = async (userId: string) => {
    const amount = parseFloat(creditAmounts[userId]);
    
    if (isNaN(amount) || amount <= 0) {
      toast({
        title: "Invalid Amount",
        description: "Please enter a valid positive number",
        variant: "destructive"
      });
      return;
    }

    try {
      setAddingCredit(prev => ({ ...prev, [userId]: true }));
      
      // Call the Supabase function to add credit
      const { error } = await supabase.rpc('add_user_credit', {
        user_uuid: userId,
        add_amount: amount
      });

      if (error) throw error;

      // Update the user in our local state
      setUsers(prevUsers => 
        prevUsers.map(user => 
          user.id === userId 
            ? { ...user, credit_balance: user.credit_balance + amount } 
            : user
        )
      );

      // Clear the input
      setCreditAmounts(prev => ({
        ...prev,
        [userId]: ""
      }));

      toast({
        title: "Success",
        description: `Added $${amount.toFixed(2)} to user's account`,
      });
      
    } catch (error) {
      console.error("Error adding credit:", error);
      toast({
        title: "Error",
        description: "Failed to add credit",
        variant: "destructive"
      });
    } finally {
      setAddingCredit(prev => ({ ...prev, [userId]: false }));
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center pb-4">
        <Input
          placeholder="Search by email..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="max-w-sm"
        />
        <Button 
          variant="outline" 
          onClick={() => fetchUsers()}
          className="ml-2"
        >
          Refresh
        </Button>
      </div>

      {loading ? (
        <div className="flex justify-center py-8">
          <div className="w-8 h-8 border-4 border-cafe-blue border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : (
        <div className="border rounded-lg overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Email</TableHead>
                <TableHead>Display Name</TableHead>
                <TableHead>Credit Balance</TableHead>
                <TableHead>Add Credit</TableHead>
                <TableHead></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsers.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8 text-gray-500">
                    {searchQuery ? "No users matching your search" : "No users found"}
                  </TableCell>
                </TableRow>
              ) : (
                filteredUsers.map(user => (
                  <TableRow key={user.id}>
                    <TableCell className="font-medium">{user.email}</TableCell>
                    <TableCell>{user.display_name || "—"}</TableCell>
                    <TableCell>${user.credit_balance.toFixed(2)}</TableCell>
                    <TableCell className="w-1/4">
                      <div className="flex items-center space-x-2">
                        <Input
                          placeholder="Amount"
                          value={creditAmounts[user.id] || ""}
                          onChange={(e) => handleCreditAmountChange(user.id, e.target.value)}
                          type="number"
                          min="0"
                          step="0.01"
                          className="max-w-[100px]"
                        />
                        <Button 
                          onClick={() => handleAddCredit(user.id)}
                          disabled={addingCredit[user.id] || !creditAmounts[user.id]}
                          size="sm"
                        >
                          {addingCredit[user.id] ? (
                            <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-1"></span>
                          ) : null}
                          Add
                        </Button>
                      </div>
                    </TableCell>
                    <TableCell>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
};

export default UsersTable;

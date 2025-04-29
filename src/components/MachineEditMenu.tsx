
import { useState, useRef } from "react";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { 
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Lock, Key, Edit, MoreVertical } from "lucide-react";

interface MachineEditMenuProps {
  machineId: string;
  machineName: string;
  onNameChange: (newName: string) => void;
}

const MachineEditMenu = ({ machineId, machineName, onNameChange }: MachineEditMenuProps) => {
  const [newName, setNewName] = useState(machineName);
  const [isRenamingActive, setIsRenamingActive] = useState(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const { toast } = useToast();

  const handleSaveName = () => {
    if (!newName.trim()) {
      toast({
        title: "Error",
        description: "Machine name cannot be empty",
        variant: "destructive"
      });
      return;
    }
    
    // Update the name in local state via callback
    onNameChange(newName);
    setIsRenamingActive(false);
    
    toast({
      title: "Success",
      description: "Machine name updated"
    });
  };

  const handleLockComputer = () => {
    // This is UI only for now - just show a toast
    toast({
      title: "Lock Command",
      description: `Lock command would be sent to machine ${machineId}`,
    });
  };

  const handleViewPassword = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };

  const placeholderPassword = "••••••••";

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm">
          <MoreVertical className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={handleViewPassword}>
          <Key className="mr-2 h-4 w-4" />
          {isPasswordVisible ? "Hide Password" : "View Password"}
        </DropdownMenuItem>
        
        {isPasswordVisible && (
          <div className="px-2 py-1.5">
            <code className="bg-gray-100 px-2 py-1 rounded text-sm">
              {placeholderPassword}
            </code>
          </div>
        )}
        
        <DropdownMenuItem onClick={handleLockComputer}>
          <Lock className="mr-2 h-4 w-4" />
          Lock Computer
        </DropdownMenuItem>
        
        <Popover open={isRenamingActive} onOpenChange={setIsRenamingActive}>
          <PopoverTrigger asChild>
            <DropdownMenuItem
              onClick={(e) => {
                e.preventDefault();
                setIsRenamingActive(true);
              }}
            >
              <Edit className="mr-2 h-4 w-4" />
              Rename Machine
            </DropdownMenuItem>
          </PopoverTrigger>
          <PopoverContent className="w-80">
            <div className="grid gap-4">
              <h4 className="font-medium leading-none">Rename Machine</h4>
              <div className="grid gap-2">
                <Input
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="New machine name"
                />
                <div className="flex justify-end gap-2">
                  <Button
                    variant="outline"
                    onClick={() => setIsRenamingActive(false)}
                    size="sm"
                  >
                    Cancel
                  </Button>
                  <Button onClick={handleSaveName} size="sm">
                    Save
                  </Button>
                </div>
              </div>
            </div>
          </PopoverContent>
        </Popover>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default MachineEditMenu;

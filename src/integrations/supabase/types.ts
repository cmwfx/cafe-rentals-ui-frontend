export type Json =
	| string
	| number
	| boolean
	| null
	| { [key: string]: Json | undefined }
	| Json[];

export type Database = {
	public: {
		Tables: {
			machines: {
				Row: {
					id: string;
					hostname: string;
					status: "available" | "occupied";
					current_session: string | null;
					name: string;
					specs: string;
					hourly_rate: number;
				};
				Insert: {
					id?: string;
					hostname: string;
					status?: "available" | "occupied";
					current_session?: string | null;
					name: string;
					specs: string;
					hourly_rate: number;
				};
				Update: {
					id?: string;
					hostname?: string;
					status?: "available" | "occupied";
					current_session?: string | null;
					name?: string;
					specs?: string;
					hourly_rate?: number;
				};
				Relationships: [
					{
						foreignKeyName: "machines_current_session_fkey";
						columns: ["current_session"];
						isOneToOne: false;
						referencedRelation: "sessions";
						referencedColumns: ["id"];
					}
				];
			};
			commands: {
				Row: {
					id: string;
					machine_id: string;
					action: "changePassword" | "lockWorkstation";
					payload: Json | null;
					dispatched: boolean;
					created_at: string;
				};
				Insert: {
					id?: string;
					machine_id: string;
					action: "changePassword" | "lockWorkstation";
					payload?: Json | null;
					dispatched?: boolean;
					created_at?: string;
				};
				Update: {
					id?: string;
					machine_id?: string;
					action?: "changePassword" | "lockWorkstation";
					payload?: Json | null;
					dispatched?: boolean;
					created_at?: string;
				};
				Relationships: [
					{
						foreignKeyName: "commands_machine_id_fkey";
						columns: ["machine_id"];
						isOneToOne: false;
						referencedRelation: "machines";
						referencedColumns: ["id"];
					}
				];
			};
			sessions: {
				Row: {
					id: string;
					machine_id: string;
					user_id: string;
					start_time: string;
					end_time: string | null;
					duration: number | null;
					cost: number | null;
					temp_password: string | null;
				};
				Insert: {
					id?: string;
					machine_id: string;
					user_id: string;
					start_time?: string;
					end_time?: string | null;
					duration?: number | null;
					cost?: number | null;
					temp_password?: string | null;
				};
				Update: {
					id?: string;
					machine_id?: string;
					user_id?: string;
					start_time?: string;
					end_time?: string | null;
					duration?: number | null;
					cost?: number | null;
					temp_password?: string | null;
				};
				Relationships: [
					{
						foreignKeyName: "sessions_machine_id_fkey";
						columns: ["machine_id"];
						isOneToOne: false;
						referencedRelation: "machines";
						referencedColumns: ["id"];
					},
					{
						foreignKeyName: "sessions_user_id_fkey";
						columns: ["user_id"];
						isOneToOne: false;
						referencedRelation: "users";
						referencedColumns: ["id"];
					}
				];
			};
			profiles: {
				Row: {
					credit_balance: number;
					display_name: string | null;
					id: string;
				};
				Insert: {
					credit_balance?: number;
					display_name?: string | null;
					id: string;
				};
				Update: {
					credit_balance?: number;
					display_name?: string | null;
					id?: string;
				};
				Relationships: [];
			};
			transactions: {
				Row: {
					amount: number;
					id: string;
					ts: string;
					type: string;
					user_id: string;
				};
				Insert: {
					amount: number;
					id?: string;
					ts?: string;
					type: string;
					user_id: string;
				};
				Update: {
					amount?: number;
					id?: string;
					ts?: string;
					type?: string;
					user_id?: string;
				};
				Relationships: [];
			};
		};
		Views: {
			[_ in never]: never;
		};
		Functions: {
			add_user_credit: {
				Args: { user_uuid: string; add_amount: number };
				Returns: undefined;
			};
			is_admin: {
				Args: Record<PropertyKey, never>;
				Returns: {
					is_admin: boolean;
				}[];
			};
		};
		Enums: {
			[_ in never]: never;
		};
		CompositeTypes: {
			[_ in never]: never;
		};
	};
};

type DefaultSchema = Database[Extract<keyof Database, "public">];

export type Tables<
	DefaultSchemaTableNameOrOptions extends
		| keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
		| { schema: keyof Database },
	TableName extends DefaultSchemaTableNameOrOptions extends {
		schema: keyof Database;
	}
		? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
				Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
		: never = never
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
	? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
			Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
			Row: infer R;
	  }
		? R
		: never
	: DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
			DefaultSchema["Views"])
	? (DefaultSchema["Tables"] &
			DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
			Row: infer R;
	  }
		? R
		: never
	: never;

export type TablesInsert<
	DefaultSchemaTableNameOrOptions extends
		| keyof DefaultSchema["Tables"]
		| { schema: keyof Database },
	TableName extends DefaultSchemaTableNameOrOptions extends {
		schema: keyof Database;
	}
		? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
		: never = never
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
	? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
			Insert: infer I;
	  }
		? I
		: never
	: DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
	? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
			Insert: infer I;
	  }
		? I
		: never
	: never;

export type TablesUpdate<
	DefaultSchemaTableNameOrOptions extends
		| keyof DefaultSchema["Tables"]
		| { schema: keyof Database },
	TableName extends DefaultSchemaTableNameOrOptions extends {
		schema: keyof Database;
	}
		? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
		: never = never
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
	? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
			Update: infer U;
	  }
		? U
		: never
	: DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
	? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
			Update: infer U;
	  }
		? U
		: never
	: never;

export type Enums<
	DefaultSchemaEnumNameOrOptions extends
		| keyof DefaultSchema["Enums"]
		| { schema: keyof Database },
	EnumName extends DefaultSchemaEnumNameOrOptions extends {
		schema: keyof Database;
	}
		? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
		: never = never
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
	? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
	: DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
	? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
	: never;

export type CompositeTypes<
	PublicCompositeTypeNameOrOptions extends
		| keyof DefaultSchema["CompositeTypes"]
		| { schema: keyof Database },
	CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
		schema: keyof Database;
	}
		? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
		: never = never
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
	? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
	: PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
	? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
	: never;

export const Constants = {
	public: {
		Enums: {},
	},
} as const;

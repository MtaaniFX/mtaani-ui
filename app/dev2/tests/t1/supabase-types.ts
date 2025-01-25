export type Json =
    | string
    | number
    | boolean
    | null
    | { [key: string]: Json | undefined }
    | Json[]

export interface Database {
    public: {
        Tables: {
            group_investments: {
                Row: {
                    created_at: string
                    created_by: string | null
                    description: string | null
                    id: string
                    name: string
                }
                Insert: {
                    created_at?: string
                    created_by?: string | null
                    description?: string | null
                    id?: string
                    name: string
                }
                Update: {
                    created_at?: string
                    created_by?: string | null
                    description?: string | null
                    id?: string
                    name?: string
                }
                Relationships: [
                    {
                        foreignKeyName: "group_investments_created_by_fkey"
                        columns: ["created_by"]
                        isOneToOne: false
                        referencedRelation: "users"
                        referencedColumns: ["id"]
                    },
                ]
            }
            investment_plans: {
                Row: {
                    created_at: string
                    features: Json | null
                    id: string
                    interest_rate: number
                    max_amount: number
                    min_amount: number
                    name: string
                }
                Insert: {
                    created_at?: string
                    features?: Json | null
                    id?: string
                    interest_rate: number
                    max_amount: number
                    min_amount: number
                    name: string
                }
                Update: {
                    created_at?: string
                    features?: Json | null
                    id?: string
                    interest_rate?: number
                    max_amount?: number
                    min_amount?: number
                    name?: string
                }
                Relationships: []
            }
            investment_terms: {
                Row: {
                    created_at: string
                    features: Json | null
                    id: string
                    name: string
                }
                Insert: {
                    created_at?: string
                    features?: Json | null
                    id?: string
                    name: string
                }
                Update: {
                    created_at?: string
                    features?: Json | null
                    id?: string
                    name?: string
                }
                Relationships: []
            }
            investment_types: {
                Row: {
                    created_at: string
                    features: Json | null
                    id: string
                    name: string
                }
                Insert: {
                    created_at?: string
                    features?: Json | null
                    id?: string
                    name: string
                }
                Update: {
                    created_at?: string
                    features?: Json | null
                    id?: string
                    name?: string
                }
                Relationships: []
            }
            user_investments: {
                Row: {
                    amount: number
                    created_at: string
                    group_id: string | null
                    id: string
                    investment_plan_id: string
                    investment_term_id: string | null
                    investment_type_id: string
                    locked_until: string | null
                    status: string | null
                    user_id: string
                }
                Insert: {
                    amount: number
                    created_at?: string
                    group_id?: string | null
                    id?: string
                    investment_plan_id: string
                    investment_term_id?: string | null
                    investment_type_id: string
                    locked_until?: string | null
                    status?: string | null
                    user_id: string
                }
                Update: {
                    amount?: number
                    created_at?: string
                    group_id?: string | null
                    id?: string
                    investment_plan_id?: string
                    investment_term_id?: string | null
                    investment_type_id?: string
                    locked_until?: string | null
                    status?: string | null
                    user_id?: string
                }
                Relationships: [
                    {
                        foreignKeyName: "user_investments_group_id_fkey"
                        columns: ["group_id"]
                        isOneToOne: false
                        referencedRelation: "group_investments"
                        referencedColumns: ["id"]
                    },
                    {
                        foreignKeyName: "user_investments_investment_plan_id_fkey"
                        columns: ["investment_plan_id"]
                        isOneToOne: false
                        referencedRelation: "investment_plans"
                        referencedColumns: ["id"]
                    },
                    {
                        foreignKeyName: "user_investments_investment_term_id_fkey"
                        columns: ["investment_term_id"]
                        isOneToOne: false
                        referencedRelation: "investment_terms"
                        referencedColumns: ["id"]
                    },
                    {
                        foreignKeyName: "user_investments_investment_type_id_fkey"
                        columns: ["investment_type_id"]
                        isOneToOne: false
                        referencedRelation: "investment_types"
                        referencedColumns: ["id"]
                    },
                    {
                        foreignKeyName: "user_investments_user_id_fkey"
                        columns: ["user_id"]
                        isOneToOne: false
                        referencedRelation: "users"
                        referencedColumns: ["id"]
                    },
                ]
            }
        }
        Views: {
            [_ in never]: never
        }
        Functions: {
            [_ in never]: never
        }
        Enums: {
            [_ in never]: never
        }
        CompositeTypes: {
            [_ in never]: never
        }
    }
}

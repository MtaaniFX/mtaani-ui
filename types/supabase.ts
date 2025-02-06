export type Json =
    | string
    | number
    | boolean
    | null
    | { [key: string]: Json | undefined }
    | Json[]

export type Database = {
    app_acl: {
        Tables: {
            role_hierarchy: {
                Row: {
                    child_role_id: number | null
                    created_at: string | null
                    id: number
                    parent_role_id: number | null
                }
                Insert: {
                    child_role_id?: number | null
                    created_at?: string | null
                    id?: number
                    parent_role_id?: number | null
                }
                Update: {
                    child_role_id?: number | null
                    created_at?: string | null
                    id?: number
                    parent_role_id?: number | null
                }
                Relationships: [
                    {
                        foreignKeyName: "role_hierarchy_child_role_id_fkey"
                        columns: ["child_role_id"]
                        isOneToOne: false
                        referencedRelation: "roles"
                        referencedColumns: ["id"]
                    },
                    {
                        foreignKeyName: "role_hierarchy_parent_role_id_fkey"
                        columns: ["parent_role_id"]
                        isOneToOne: false
                        referencedRelation: "roles"
                        referencedColumns: ["id"]
                    },
                ]
            }
            roles: {
                Row: {
                    created_at: string | null
                    description: string | null
                    id: number
                    name: string
                    updated_at: string | null
                }
                Insert: {
                    created_at?: string | null
                    description?: string | null
                    id?: number
                    name: string
                    updated_at?: string | null
                }
                Update: {
                    created_at?: string | null
                    description?: string | null
                    id?: number
                    name?: string
                    updated_at?: string | null
                }
                Relationships: []
            }
            user_roles: {
                Row: {
                    created_at: string | null
                    id: number
                    role_id: number | null
                    user_id: string | null
                }
                Insert: {
                    created_at?: string | null
                    id?: number
                    role_id?: number | null
                    user_id?: string | null
                }
                Update: {
                    created_at?: string | null
                    id?: number
                    role_id?: number | null
                    user_id?: string | null
                }
                Relationships: [
                    {
                        foreignKeyName: "user_roles_role_id_fkey"
                        columns: ["role_id"]
                        isOneToOne: false
                        referencedRelation: "roles"
                        referencedColumns: ["id"]
                    },
                ]
            }
        }
        Views: {
            [_ in never]: never
        }
        Functions: {
            get_parent_roles: {
                Args: {
                    role_name: string
                }
                Returns: {
                    role_id: number
                }[]
            }
            is_user_authorized: {
                Args: {
                    user_uuid: string
                    required_role_name: string
                }
                Returns: boolean
            }
        }
        Enums: {
            [_ in never]: never
        }
        CompositeTypes: {
            [_ in never]: never
        }
    }
    graphql_public: {
        Tables: {
            [_ in never]: never
        }
        Views: {
            [_ in never]: never
        }
        Functions: {
            graphql: {
                Args: {
                    operationName?: string
                    query?: string
                    variables?: Json
                    extensions?: Json
                }
                Returns: Json
            }
        }
        Enums: {
            [_ in never]: never
        }
        CompositeTypes: {
            [_ in never]: never
        }
    }
    investments: {
        Tables: {
            group_contributions: {
                Row: {
                    amount: number
                    contributed_at: string
                    group_id: string
                    id: string
                    user_id: string
                }
                Insert: {
                    amount: number
                    contributed_at?: string
                    group_id: string
                    id?: string
                    user_id: string
                }
                Update: {
                    amount?: number
                    contributed_at?: string
                    group_id?: string
                    id?: string
                    user_id?: string
                }
                Relationships: [
                    {
                        foreignKeyName: "group_contributions_group_id_user_id_fkey"
                        columns: ["group_id", "user_id"]
                        isOneToOne: false
                        referencedRelation: "group_members"
                        referencedColumns: ["group_id", "user_id"]
                    },
                ]
            }
            group_invites: {
                Row: {
                    created_at: string
                    expires_at: string | null
                    group_id: string
                    id: string
                    invite_link: string
                    invited_by_id: string
                    invited_email: string | null
                    is_active: boolean | null
                }
                Insert: {
                    created_at?: string
                    expires_at?: string | null
                    group_id: string
                    id?: string
                    invite_link: string
                    invited_by_id: string
                    invited_email?: string | null
                    is_active?: boolean | null
                }
                Update: {
                    created_at?: string
                    expires_at?: string | null
                    group_id?: string
                    id?: string
                    invite_link?: string
                    invited_by_id?: string
                    invited_email?: string | null
                    is_active?: boolean | null
                }
                Relationships: [
                    {
                        foreignKeyName: "group_invites_group_id_fkey"
                        columns: ["group_id"]
                        isOneToOne: false
                        referencedRelation: "groups"
                        referencedColumns: ["id"]
                    },
                ]
            }
            group_members: {
                Row: {
                    group_id: string
                    invite_id: string | null
                    is_active: boolean | null
                    joined_at: string
                    role_id: number
                    user_id: string
                }
                Insert: {
                    group_id: string
                    invite_id?: string | null
                    is_active?: boolean | null
                    joined_at?: string
                    role_id: number
                    user_id: string
                }
                Update: {
                    group_id?: string
                    invite_id?: string | null
                    is_active?: boolean | null
                    joined_at?: string
                    role_id?: number
                    user_id?: string
                }
                Relationships: [
                    {
                        foreignKeyName: "group_members_group_id_fkey"
                        columns: ["group_id"]
                        isOneToOne: false
                        referencedRelation: "groups"
                        referencedColumns: ["id"]
                    },
                    {
                        foreignKeyName: "group_members_invite_id_fkey"
                        columns: ["invite_id"]
                        isOneToOne: false
                        referencedRelation: "group_invites"
                        referencedColumns: ["id"]
                    },
                    {
                        foreignKeyName: "group_members_role_id_fkey"
                        columns: ["role_id"]
                        isOneToOne: false
                        referencedRelation: "group_roles"
                        referencedColumns: ["id"]
                    },
                ]
            }
            group_roles: {
                Row: {
                    description: string | null
                    id: number
                    name: string
                }
                Insert: {
                    description?: string | null
                    id?: number
                    name: string
                }
                Update: {
                    description?: string | null
                    id?: number
                    name?: string
                }
                Relationships: []
            }
            groups: {
                Row: {
                    created_at: string
                    id: string
                    invite_link: string | null
                    invite_link_active: boolean | null
                    updated_at: string
                }
                Insert: {
                    created_at?: string
                    id: string
                    invite_link?: string | null
                    invite_link_active?: boolean | null
                    updated_at?: string
                }
                Update: {
                    created_at?: string
                    id?: string
                    invite_link?: string | null
                    invite_link_active?: boolean | null
                    updated_at?: string
                }
                Relationships: [
                    {
                        foreignKeyName: "groups_id_fkey"
                        columns: ["id"]
                        isOneToOne: true
                        referencedRelation: "plans"
                        referencedColumns: ["id"]
                    },
                ]
            }
            plan_state_logs: {
                Row: {
                    changed_at: string
                    changed_by_id: string
                    id: string
                    plan_id: string
                    state_id: number
                }
                Insert: {
                    changed_at?: string
                    changed_by_id: string
                    id?: string
                    plan_id: string
                    state_id: number
                }
                Update: {
                    changed_at?: string
                    changed_by_id?: string
                    id?: string
                    plan_id?: string
                    state_id?: number
                }
                Relationships: [
                    {
                        foreignKeyName: "plan_state_logs_plan_id_fkey"
                        columns: ["plan_id"]
                        isOneToOne: false
                        referencedRelation: "plans"
                        referencedColumns: ["id"]
                    },
                    {
                        foreignKeyName: "plan_state_logs_state_id_fkey"
                        columns: ["state_id"]
                        isOneToOne: false
                        referencedRelation: "plan_states"
                        referencedColumns: ["id"]
                    },
                ]
            }
            plan_states: {
                Row: {
                    description: string | null
                    id: number
                    name: string
                }
                Insert: {
                    description?: string | null
                    id?: number
                    name: string
                }
                Update: {
                    description?: string | null
                    id?: number
                    name?: string
                }
                Relationships: []
            }
            plan_subtypes: {
                Row: {
                    description: string | null
                    id: number
                    name: string
                }
                Insert: {
                    description?: string | null
                    id?: number
                    name: string
                }
                Update: {
                    description?: string | null
                    id?: number
                    name?: string
                }
                Relationships: []
            }
            plan_types: {
                Row: {
                    description: string | null
                    id: number
                    name: string
                }
                Insert: {
                    description?: string | null
                    id?: number
                    name: string
                }
                Update: {
                    description?: string | null
                    id?: number
                    name?: string
                }
                Relationships: []
            }
            plans: {
                Row: {
                    created_at: string
                    creator_id: string
                    current_state_id: number
                    description: string | null
                    id: string
                    name: string
                    plan_subtype_id: number | null
                    plan_type_id: number
                    updated_at: string
                }
                Insert: {
                    created_at?: string
                    creator_id: string
                    current_state_id?: number
                    description?: string | null
                    id?: string
                    name: string
                    plan_subtype_id?: number | null
                    plan_type_id: number
                    updated_at?: string
                }
                Update: {
                    created_at?: string
                    creator_id?: string
                    current_state_id?: number
                    description?: string | null
                    id?: string
                    name?: string
                    plan_subtype_id?: number | null
                    plan_type_id?: number
                    updated_at?: string
                }
                Relationships: [
                    {
                        foreignKeyName: "plans_current_state_id_fkey"
                        columns: ["current_state_id"]
                        isOneToOne: false
                        referencedRelation: "plan_states"
                        referencedColumns: ["id"]
                    },
                    {
                        foreignKeyName: "plans_plan_subtype_id_fkey"
                        columns: ["plan_subtype_id"]
                        isOneToOne: false
                        referencedRelation: "plan_subtypes"
                        referencedColumns: ["id"]
                    },
                    {
                        foreignKeyName: "plans_plan_type_id_fkey"
                        columns: ["plan_type_id"]
                        isOneToOne: false
                        referencedRelation: "plan_types"
                        referencedColumns: ["id"]
                    },
                ]
            }
        }
        Views: {
            [_ in never]: never
        }
        Functions: {
            accept_group_invitation: {
                Args: {
                    p_invite_id: string
                    p_user_id: string
                }
                Returns: undefined
            }
            add_group_member: {
                Args: {
                    p_group_id: string
                    p_user_id: string
                    p_role_id: number
                    p_invite_id?: string
                    p_is_active?: boolean
                }
                Returns: undefined
            }
            add_member_with_invite_link: {
                Args: {
                    p_invite_link: string
                    p_user_id: string
                }
                Returns: undefined
            }
            change_plan_state: {
                Args: {
                    p_plan_id: string
                    p_new_state_id: number
                    p_changed_by_id: string
                }
                Returns: undefined
            }
            create_group: {
                Args: {
                    p_name: string
                    p_description: string
                    p_creator_id: string
                }
                Returns: string
            }
            create_plan: {
                Args: {
                    p_name: string
                    p_description: string
                    p_creator_id: string
                    p_plan_type_id: number
                    p_plan_subtype_id?: number
                }
                Returns: string
            }
            delete_contribution: {
                Args: {
                    p_contribution_id: string
                }
                Returns: undefined
            }
            delete_group: {
                Args: {
                    p_group_id: string
                }
                Returns: undefined
            }
            delete_group_invite: {
                Args: {
                    p_invite_id: string
                }
                Returns: undefined
            }
            delete_plan: {
                Args: {
                    p_plan_id: string
                }
                Returns: undefined
            }
            generate_group_invite_link: {
                Args: {
                    p_group_id: string
                    p_invited_by_id: string
                    p_invited_email: string
                    p_expires_at: string
                }
                Returns: string
            }
            get_group_by_id: {
                Args: {
                    p_group_id: string
                }
                Returns: {
                    id: string
                    name: string
                    description: string
                    creator_id: string
                    plan_type_id: number
                    plan_subtype_id: number
                    current_state_id: number
                    created_at: string
                    updated_at: string
                    invite_link: string
                    invite_link_active: boolean
                }[]
            }
            get_group_contributions: {
                Args: {
                    p_group_id: string
                }
                Returns: {
                    id: string
                    user_id: string
                    amount: number
                    contributed_at: string
                }[]
            }
            get_group_invites: {
                Args: {
                    p_group_id: string
                }
                Returns: {
                    id: string
                    invited_by_id: string
                    invited_email: string
                    invite_link: string
                    created_at: string
                    expires_at: string
                    is_active: boolean
                }[]
            }
            get_group_members: {
                Args: {
                    p_group_id: string
                }
                Returns: {
                    user_id: string
                    role_id: number
                    joined_at: string
                    is_active: boolean
                }[]
            }
            get_group_total_contributions: {
                Args: {
                    p_group_id: string
                }
                Returns: number
            }
            get_plan_by_id: {
                Args: {
                    p_plan_id: string
                }
                Returns: {
                    id: string
                    name: string
                    description: string
                    creator_id: string
                    plan_type_id: number
                    plan_subtype_id: number
                    current_state_id: number
                    created_at: string
                    updated_at: string
                }[]
            }
            get_user_group_contributions: {
                Args: {
                    p_group_id: string
                    p_user_id: string
                }
                Returns: {
                    id: string
                    amount: number
                    contributed_at: string
                }[]
            }
            get_user_group_role: {
                Args: {
                    p_group_id: string
                    p_user_id: string
                }
                Returns: number
            }
            get_user_groups: {
                Args: {
                    p_user_id: string
                }
                Returns: {
                    id: string
                    name: string
                    description: string
                    creator_id: string
                    plan_type_id: number
                    plan_subtype_id: number
                    current_state_id: number
                    created_at: string
                    updated_at: string
                    invite_link: string
                    invite_link_active: boolean
                }[]
            }
            get_user_plans: {
                Args: {
                    p_user_id: string
                }
                Returns: {
                    id: string
                    name: string
                    description: string
                    creator_id: string
                    plan_type_id: number
                    plan_subtype_id: number
                    current_state_id: number
                    created_at: string
                    updated_at: string
                }[]
            }
            get_user_total_contributions: {
                Args: {
                    p_group_id: string
                    p_user_id: string
                }
                Returns: number
            }
            record_contribution: {
                Args: {
                    p_group_id: string
                    p_user_id: string
                    p_amount: number
                }
                Returns: string
            }
            reject_group_invitation: {
                Args: {
                    p_invite_id: string
                    p_user_id: string
                }
                Returns: undefined
            }
            remove_group_member: {
                Args: {
                    p_group_id: string
                    p_user_id: string
                }
                Returns: undefined
            }
            revoke_group_invite: {
                Args: {
                    p_invite_id: string
                }
                Returns: undefined
            }
            toggle_group_invite_link: {
                Args: {
                    p_group_id: string
                    p_is_active: boolean
                }
                Returns: undefined
            }
            update_contribution: {
                Args: {
                    p_contribution_id: string
                    p_amount: number
                }
                Returns: undefined
            }
            update_group: {
                Args: {
                    p_group_id: string
                    p_name: string
                    p_description: string
                }
                Returns: undefined
            }
            update_group_member_role: {
                Args: {
                    p_group_id: string
                    p_user_id: string
                    p_new_role_id: number
                }
                Returns: undefined
            }
            update_plan: {
                Args: {
                    p_plan_id: string
                    p_name: string
                    p_description: string
                }
                Returns: undefined
            }
        }
        Enums: {
            [_ in never]: never
        }
        CompositeTypes: {
            [_ in never]: never
        }
    }
    public: {
        Tables: {
            [_ in never]: never
        }
        Views: {
            [_ in never]: never
        }
        Functions: {
            gtrgm_compress: {
                Args: {
                    "": unknown
                }
                Returns: unknown
            }
            gtrgm_decompress: {
                Args: {
                    "": unknown
                }
                Returns: unknown
            }
            gtrgm_in: {
                Args: {
                    "": unknown
                }
                Returns: unknown
            }
            gtrgm_options: {
                Args: {
                    "": unknown
                }
                Returns: undefined
            }
            gtrgm_out: {
                Args: {
                    "": unknown
                }
                Returns: unknown
            }
            set_limit: {
                Args: {
                    "": number
                }
                Returns: number
            }
            show_limit: {
                Args: Record<PropertyKey, never>
                Returns: number
            }
            show_trgm: {
                Args: {
                    "": string
                }
                Returns: string[]
            }
        }
        Enums: {
            [_ in never]: never
        }
        CompositeTypes: {
            [_ in never]: never
        }
    }
    users: {
        Tables: {
            profiles: {
                Row: {
                    bio: string | null
                    created_at: string
                    first_name: string | null
                    full_name: string | null
                    id: string
                    id_number: string | null
                    last_name: string | null
                    profile_picture_url: string | null
                    updated_at: string
                    username: string | null
                }
                Insert: {
                    bio?: string | null
                    created_at?: string
                    first_name?: string | null
                    full_name?: string | null
                    id: string
                    id_number?: string | null
                    last_name?: string | null
                    profile_picture_url?: string | null
                    updated_at?: string
                    username?: string | null
                }
                Update: {
                    bio?: string | null
                    created_at?: string
                    first_name?: string | null
                    full_name?: string | null
                    id?: string
                    id_number?: string | null
                    last_name?: string | null
                    profile_picture_url?: string | null
                    updated_at?: string
                    username?: string | null
                }
                Relationships: []
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

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
    PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
    TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
    ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
            Row: infer R
        }
    ? R
    : never
    : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
            Row: infer R
        }
    ? R
    : never
    : never

export type TablesInsert<
    PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
    TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
    ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
        Insert: infer I
    }
    ? I
    : never
    : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
    }
    ? I
    : never
    : never

export type TablesUpdate<
    PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
    TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
    ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
        Update: infer U
    }
    ? U
    : never
    : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
    }
    ? U
    : never
    : never

export type Enums<
    PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
    EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
    ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
    : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
    PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
    CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
        schema: keyof Database
    }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
    ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
    : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

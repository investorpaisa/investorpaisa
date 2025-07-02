export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      bookmarks: {
        Row: {
          created_at: string | null
          id: string
          post_id: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          post_id: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          post_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "bookmarks_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "posts"
            referencedColumns: ["id"]
          },
        ]
      }
      categories: {
        Row: {
          created_at: string | null
          description: string | null
          icon: string | null
          id: string
          name: string
          post_count: number | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          icon?: string | null
          id?: string
          name: string
          post_count?: number | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          icon?: string | null
          id?: string
          name?: string
          post_count?: number | null
          updated_at?: string | null
        }
        Relationships: []
      }
      comments: {
        Row: {
          content: string
          created_at: string | null
          id: string
          likes: number | null
          parent_id: string | null
          post_id: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          content: string
          created_at?: string | null
          id?: string
          likes?: number | null
          parent_id?: string | null
          post_id: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          content?: string
          created_at?: string | null
          id?: string
          likes?: number | null
          parent_id?: string | null
          post_id?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "comments_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "comments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "comments_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "posts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "comments_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      companies: {
        Row: {
          banner_url: string | null
          company_size: string | null
          created_at: string | null
          description: string | null
          id: string
          industry: string | null
          location: string | null
          logo_url: string | null
          name: string
          website: string | null
        }
        Insert: {
          banner_url?: string | null
          company_size?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          industry?: string | null
          location?: string | null
          logo_url?: string | null
          name: string
          website?: string | null
        }
        Update: {
          banner_url?: string | null
          company_size?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          industry?: string | null
          location?: string | null
          logo_url?: string | null
          name?: string
          website?: string | null
        }
        Relationships: []
      }
      connections: {
        Row: {
          connected_at: string | null
          created_at: string | null
          id: string
          message: string | null
          receiver_id: string | null
          requester_id: string | null
          status: string
        }
        Insert: {
          connected_at?: string | null
          created_at?: string | null
          id?: string
          message?: string | null
          receiver_id?: string | null
          requester_id?: string | null
          status?: string
        }
        Update: {
          connected_at?: string | null
          created_at?: string | null
          id?: string
          message?: string | null
          receiver_id?: string | null
          requester_id?: string | null
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "connections_receiver_id_fkey"
            columns: ["receiver_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "connections_requester_id_fkey"
            columns: ["requester_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      education: {
        Row: {
          activities: string | null
          created_at: string | null
          degree: string | null
          description: string | null
          end_year: number | null
          field_of_study: string | null
          id: string
          institution: string
          start_year: number | null
          user_id: string | null
        }
        Insert: {
          activities?: string | null
          created_at?: string | null
          degree?: string | null
          description?: string | null
          end_year?: number | null
          field_of_study?: string | null
          id?: string
          institution: string
          start_year?: number | null
          user_id?: string | null
        }
        Update: {
          activities?: string | null
          created_at?: string | null
          degree?: string | null
          description?: string | null
          end_year?: number | null
          field_of_study?: string | null
          id?: string
          institution?: string
          start_year?: number | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "education_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      email_integrations: {
        Row: {
          access_token: string | null
          created_at: string | null
          id: string
          is_active: boolean | null
          last_sync: string | null
          provider: string | null
          refresh_token: string | null
          token_expires_at: string | null
          user_id: string | null
        }
        Insert: {
          access_token?: string | null
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          last_sync?: string | null
          provider?: string | null
          refresh_token?: string | null
          token_expires_at?: string | null
          user_id?: string | null
        }
        Update: {
          access_token?: string | null
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          last_sync?: string | null
          provider?: string | null
          refresh_token?: string | null
          token_expires_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "email_integrations_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users_extended"
            referencedColumns: ["id"]
          },
        ]
      }
      experiences: {
        Row: {
          company: string
          created_at: string | null
          description: string | null
          end_date: string | null
          id: string
          industry: string | null
          is_current: boolean | null
          location: string | null
          position: string
          start_date: string | null
          user_id: string | null
        }
        Insert: {
          company: string
          created_at?: string | null
          description?: string | null
          end_date?: string | null
          id?: string
          industry?: string | null
          is_current?: boolean | null
          location?: string | null
          position: string
          start_date?: string | null
          user_id?: string | null
        }
        Update: {
          company?: string
          created_at?: string | null
          description?: string | null
          end_date?: string | null
          id?: string
          industry?: string | null
          is_current?: boolean | null
          location?: string | null
          position?: string
          start_date?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "experiences_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      financial_metrics: {
        Row: {
          annualized_returns: number | null
          asset_allocation: Json | null
          calculated_at: string | null
          id: string
          investment_returns: number | null
          portfolio_size: number | null
          user_id: string | null
        }
        Insert: {
          annualized_returns?: number | null
          asset_allocation?: Json | null
          calculated_at?: string | null
          id?: string
          investment_returns?: number | null
          portfolio_size?: number | null
          user_id?: string | null
        }
        Update: {
          annualized_returns?: number | null
          asset_allocation?: Json | null
          calculated_at?: string | null
          id?: string
          investment_returns?: number | null
          portfolio_size?: number | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "financial_metrics_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "users_extended"
            referencedColumns: ["id"]
          },
        ]
      }
      follows: {
        Row: {
          created_at: string | null
          follower_id: string
          following_id: string
          id: string
        }
        Insert: {
          created_at?: string | null
          follower_id: string
          following_id: string
          id?: string
        }
        Update: {
          created_at?: string | null
          follower_id?: string
          following_id?: string
          id?: string
        }
        Relationships: [
          {
            foreignKeyName: "follows_follower_id_fkey"
            columns: ["follower_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "follows_following_id_fkey"
            columns: ["following_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      likes: {
        Row: {
          created_at: string | null
          id: string
          liked_at: string | null
          post_id: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          liked_at?: string | null
          post_id: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          liked_at?: string | null
          post_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "likes_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "posts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "likes_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      market_insights: {
        Row: {
          author_id: string | null
          category: string | null
          content: string | null
          created_at: string | null
          engagement_metrics: Json | null
          id: string
          published_at: string | null
          source: string | null
          title: string
        }
        Insert: {
          author_id?: string | null
          category?: string | null
          content?: string | null
          created_at?: string | null
          engagement_metrics?: Json | null
          id?: string
          published_at?: string | null
          source?: string | null
          title: string
        }
        Update: {
          author_id?: string | null
          category?: string | null
          content?: string | null
          created_at?: string | null
          engagement_metrics?: Json | null
          id?: string
          published_at?: string | null
          source?: string | null
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "market_insights_author_id_fkey"
            columns: ["author_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      messages: {
        Row: {
          content: string
          created_at: string | null
          id: string
          is_read: boolean | null
          receiver_id: string
          sender_id: string
          updated_at: string | null
        }
        Insert: {
          content: string
          created_at?: string | null
          id?: string
          is_read?: boolean | null
          receiver_id: string
          sender_id: string
          updated_at?: string | null
        }
        Update: {
          content?: string
          created_at?: string | null
          id?: string
          is_read?: boolean | null
          receiver_id?: string
          sender_id?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "messages_receiver_id_fkey"
            columns: ["receiver_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "messages_sender_id_fkey"
            columns: ["sender_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      news_articles: {
        Row: {
          category: string | null
          content: string | null
          created_at: string | null
          id: string
          published_at: string | null
          relevance_score: number | null
          source: string | null
          summary: string | null
          thumbnail_url: string | null
          title: string
          updated_at: string | null
          url: string | null
        }
        Insert: {
          category?: string | null
          content?: string | null
          created_at?: string | null
          id: string
          published_at?: string | null
          relevance_score?: number | null
          source?: string | null
          summary?: string | null
          thumbnail_url?: string | null
          title: string
          updated_at?: string | null
          url?: string | null
        }
        Update: {
          category?: string | null
          content?: string | null
          created_at?: string | null
          id?: string
          published_at?: string | null
          relevance_score?: number | null
          source?: string | null
          summary?: string | null
          thumbnail_url?: string | null
          title?: string
          updated_at?: string | null
          url?: string | null
        }
        Relationships: []
      }
      parsed_transactions: {
        Row: {
          broker: string | null
          created_at: string | null
          email_message_id: string | null
          id: string
          price: number
          quantity: number
          ticker: string
          transaction_date: string | null
          transaction_type: string | null
          user_id: string | null
        }
        Insert: {
          broker?: string | null
          created_at?: string | null
          email_message_id?: string | null
          id?: string
          price: number
          quantity: number
          ticker: string
          transaction_date?: string | null
          transaction_type?: string | null
          user_id?: string | null
        }
        Update: {
          broker?: string | null
          created_at?: string | null
          email_message_id?: string | null
          id?: string
          price?: number
          quantity?: number
          ticker?: string
          transaction_date?: string | null
          transaction_type?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "parsed_transactions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users_extended"
            referencedColumns: ["id"]
          },
        ]
      }
      post_shares: {
        Row: {
          commentary: string | null
          created_at: string | null
          id: string
          post_id: string
          share_type: string
          target_id: string | null
          user_id: string
        }
        Insert: {
          commentary?: string | null
          created_at?: string | null
          id?: string
          post_id: string
          share_type: string
          target_id?: string | null
          user_id: string
        }
        Update: {
          commentary?: string | null
          created_at?: string | null
          id?: string
          post_id?: string
          share_type?: string
          target_id?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "post_shares_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "posts"
            referencedColumns: ["id"]
          },
        ]
      }
      posts: {
        Row: {
          category_id: string | null
          comment_count: number | null
          content: string
          created_at: string | null
          hashtags: string[] | null
          id: string
          image_url: string | null
          likes: number | null
          title: string
          updated_at: string | null
          user_id: string
          visibility: string | null
        }
        Insert: {
          category_id?: string | null
          comment_count?: number | null
          content: string
          created_at?: string | null
          hashtags?: string[] | null
          id?: string
          image_url?: string | null
          likes?: number | null
          title: string
          updated_at?: string | null
          user_id: string
          visibility?: string | null
        }
        Update: {
          category_id?: string | null
          comment_count?: number | null
          content?: string
          created_at?: string | null
          hashtags?: string[] | null
          id?: string
          image_url?: string | null
          likes?: number | null
          title?: string
          updated_at?: string | null
          user_id?: string
          visibility?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "posts_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "posts_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      professional_details: {
        Row: {
          certifications: string[] | null
          created_at: string | null
          education: Json | null
          id: string
          job_title: string | null
          skills: string[] | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          certifications?: string[] | null
          created_at?: string | null
          education?: Json | null
          id?: string
          job_title?: string | null
          skills?: string[] | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          certifications?: string[] | null
          created_at?: string | null
          education?: Json | null
          id?: string
          job_title?: string | null
          skills?: string[] | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "professional_details_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "users_extended"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          about: string | null
          avatar_url: string | null
          banner_image: string | null
          bio: string | null
          connection_count: number | null
          created_at: string | null
          current_company: string | null
          experience_years: number | null
          followers: number | null
          following: number | null
          full_name: string | null
          headline: string | null
          id: string
          industry: string | null
          is_verified: boolean | null
          location: string | null
          onboarding_completed: boolean | null
          premium_member: boolean | null
          role: string
          search_vector: unknown | null
          updated_at: string | null
          username: string | null
          verification_status: string | null
        }
        Insert: {
          about?: string | null
          avatar_url?: string | null
          banner_image?: string | null
          bio?: string | null
          connection_count?: number | null
          created_at?: string | null
          current_company?: string | null
          experience_years?: number | null
          followers?: number | null
          following?: number | null
          full_name?: string | null
          headline?: string | null
          id: string
          industry?: string | null
          is_verified?: boolean | null
          location?: string | null
          onboarding_completed?: boolean | null
          premium_member?: boolean | null
          role?: string
          search_vector?: unknown | null
          updated_at?: string | null
          username?: string | null
          verification_status?: string | null
        }
        Update: {
          about?: string | null
          avatar_url?: string | null
          banner_image?: string | null
          bio?: string | null
          connection_count?: number | null
          created_at?: string | null
          current_company?: string | null
          experience_years?: number | null
          followers?: number | null
          following?: number | null
          full_name?: string | null
          headline?: string | null
          id?: string
          industry?: string | null
          is_verified?: boolean | null
          location?: string | null
          onboarding_completed?: boolean | null
          premium_member?: boolean | null
          role?: string
          search_vector?: unknown | null
          updated_at?: string | null
          username?: string | null
          verification_status?: string | null
        }
        Relationships: []
      }
      public_profile: {
        Row: {
          created_at: string | null
          id: string
          is_public: boolean | null
          profile_url: string | null
          showcase_metrics: Json | null
          updated_at: string | null
          user_id: string | null
          visible_sections: string[] | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          is_public?: boolean | null
          profile_url?: string | null
          showcase_metrics?: Json | null
          updated_at?: string | null
          user_id?: string | null
          visible_sections?: string[] | null
        }
        Update: {
          created_at?: string | null
          id?: string
          is_public?: boolean | null
          profile_url?: string | null
          showcase_metrics?: Json | null
          updated_at?: string | null
          user_id?: string | null
          visible_sections?: string[] | null
        }
        Relationships: [
          {
            foreignKeyName: "public_profile_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "users_extended"
            referencedColumns: ["id"]
          },
        ]
      }
      reposts: {
        Row: {
          content: string | null
          created_at: string
          id: string
          post_id: string
          user_id: string
        }
        Insert: {
          content?: string | null
          created_at?: string
          id?: string
          post_id: string
          user_id: string
        }
        Update: {
          content?: string | null
          created_at?: string
          id?: string
          post_id?: string
          user_id?: string
        }
        Relationships: []
      }
      skills: {
        Row: {
          created_at: string | null
          endorsement_count: number | null
          id: string
          skill_name: string
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          endorsement_count?: number | null
          id?: string
          skill_name: string
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          endorsement_count?: number | null
          id?: string
          skill_name?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "skills_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      tracked_assets: {
        Row: {
          asset_type: string | null
          created_at: string | null
          current_price: number | null
          id: string
          purchase_date: string | null
          purchase_price: number | null
          quantity: number
          ticker: string
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          asset_type?: string | null
          created_at?: string | null
          current_price?: number | null
          id?: string
          purchase_date?: string | null
          purchase_price?: number | null
          quantity?: number
          ticker: string
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          asset_type?: string | null
          created_at?: string | null
          current_price?: number | null
          id?: string
          purchase_date?: string | null
          purchase_price?: number | null
          quantity?: number
          ticker?: string
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "tracked_assets_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users_extended"
            referencedColumns: ["id"]
          },
        ]
      }
      user_achievements: {
        Row: {
          achievement_type: string
          badge_icon: string | null
          badge_name: string
          criteria_met: Json | null
          description: string | null
          earned_at: string | null
          id: string
          user_id: string | null
        }
        Insert: {
          achievement_type: string
          badge_icon?: string | null
          badge_name: string
          criteria_met?: Json | null
          description?: string | null
          earned_at?: string | null
          id?: string
          user_id?: string | null
        }
        Update: {
          achievement_type?: string
          badge_icon?: string | null
          badge_name?: string
          criteria_met?: Json | null
          description?: string | null
          earned_at?: string | null
          id?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "user_achievements_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users_extended"
            referencedColumns: ["id"]
          },
        ]
      }
      user_activities: {
        Row: {
          activity_type: string
          created_at: string
          id: string
          target_id: string
          target_type: string
          user_id: string
        }
        Insert: {
          activity_type: string
          created_at?: string
          id?: string
          target_id: string
          target_type: string
          user_id: string
        }
        Update: {
          activity_type?: string
          created_at?: string
          id?: string
          target_id?: string
          target_type?: string
          user_id?: string
        }
        Relationships: []
      }
      user_searches: {
        Row: {
          created_at: string
          id: string
          search_query: string
          search_type: string | null
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          search_query: string
          search_type?: string | null
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          search_query?: string
          search_type?: string | null
          user_id?: string
        }
        Relationships: []
      }
      users_extended: {
        Row: {
          created_at: string | null
          email: string
          financial_goals: Json | null
          full_name: string
          id: string
          location: string | null
          onboarding_completed: boolean | null
          profession: string | null
          risk_profile: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          email: string
          financial_goals?: Json | null
          full_name: string
          id: string
          location?: string | null
          onboarding_completed?: boolean | null
          profession?: string | null
          risk_profile?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          email?: string
          financial_goals?: Json | null
          full_name?: string
          id?: string
          location?: string | null
          onboarding_completed?: boolean | null
          profession?: string | null
          risk_profile?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      calculate_portfolio_value: {
        Args: { p_user_id: string }
        Returns: number
      }
      citext: {
        Args: { "": boolean } | { "": string } | { "": unknown }
        Returns: string
      }
      citext_hash: {
        Args: { "": string }
        Returns: number
      }
      citextin: {
        Args: { "": unknown }
        Returns: string
      }
      citextout: {
        Args: { "": string }
        Returns: unknown
      }
      citextrecv: {
        Args: { "": unknown }
        Returns: string
      }
      citextsend: {
        Args: { "": string }
        Returns: string
      }
      decrement_comments: {
        Args: { post_id: string }
        Returns: undefined
      }
      decrement_followers: {
        Args: { user_id: string }
        Returns: undefined
      }
      decrement_following: {
        Args: { user_id: string }
        Returns: undefined
      }
      decrement_likes: {
        Args: { post_id: string }
        Returns: undefined
      }
      decrement_reposts: {
        Args: { post_id: string }
        Returns: undefined
      }
      get_conversations: {
        Args: { user_id: string }
        Returns: {
          other_user_id: string
        }[]
      }
      increment_comments: {
        Args: { post_id: string }
        Returns: undefined
      }
      increment_followers: {
        Args: { user_id: string }
        Returns: undefined
      }
      increment_following: {
        Args: { user_id: string }
        Returns: undefined
      }
      increment_likes: {
        Args: { post_id: string }
        Returns: undefined
      }
      increment_reposts: {
        Args: { post_id: string }
        Returns: undefined
      }
      is_admin: {
        Args: { user_id: string }
        Returns: boolean
      }
      is_expert: {
        Args: { user_id: string }
        Returns: boolean
      }
      update_financial_metrics: {
        Args: { p_user_id: string }
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
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const

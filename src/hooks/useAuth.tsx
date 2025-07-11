
import { useState, useEffect, createContext, useContext, ReactNode } from 'react'
import { supabase } from '@/integrations/supabase/client'
import { User as SupabaseUser } from '@supabase/supabase-js'
import { User } from '@/data/models'

interface AuthContextType {
  user: SupabaseUser | null
  userProfile: User | null
  login: (email: string, password: string) => Promise<boolean>
  logout: () => Promise<void>
  loading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<SupabaseUser | null>(null)
  const [userProfile, setUserProfile] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Set up auth state listener FIRST
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('Auth state changed:', event, session?.user?.email)
      setUser(session?.user ?? null)
      if (session?.user) {
        setTimeout(() => {
          fetchUserProfile(session.user.id)
        }, 0)
      } else {
        setUserProfile(null)
      }
      setLoading(false)
    })

    // THEN check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      console.log('Initial session:', session?.user?.email)
      setUser(session?.user ?? null)
      if (session?.user) {
        fetchUserProfile(session.user.id)
      }
      setLoading(false)
    })

    return () => subscription.unsubscribe()
  }, [])

  const fetchUserProfile = async (userId: string) => {
    try {
      console.log('Fetching user profile for:', userId)
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .single()

      if (error) {
        console.error('Error fetching user profile:', error)
        return
      }

      if (data) {
        const userProfile: User = {
          id: data.id,
          name: data.name,
          email: data.email,
          role: data.role as "superAdmin" | "admin" | "manager" | "cashier" | "waiter" | "chef" | "barista",
          avatar: data.avatar,
          phone: data.phone,
          hireDate: data.hire_date,
          status: data.status as "active" | "inactive" | "suspended",
          cafeId: data.cafe_id,
        }
        console.log('User profile loaded:', userProfile)
        setUserProfile(userProfile)
      }
    } catch (error) {
      console.error('Error fetching user profile:', error)
    }
  }

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      console.log('Attempting login for:', email)
      setLoading(true)
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) {
        console.error('Login error:', error.message)
        setLoading(false)
        return false
      }

      if (data.user) {
        console.log('Login successful for:', data.user.email)
        setLoading(false)
        return true
      }

      setLoading(false)
      return false
    } catch (error) {
      console.error('Login error:', error)
      setLoading(false)
      return false
    }
  }

  const logout = async () => {
    try {
      console.log('Logging out user')
      await supabase.auth.signOut()
      setUser(null)
      setUserProfile(null)
    } catch (error) {
      console.error('Logout error:', error)
    }
  }

  return (
    <AuthContext.Provider value={{ user, userProfile, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

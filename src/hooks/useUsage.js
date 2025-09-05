import { useState, useEffect, useContext } from 'react';
import supabase from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';

export const useUsage = () => {
  const [usage, setUsage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useAuth();

  const fetchUsage = async () => {
    if (!user) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const { data, error } = await supabase
        .rpc('get_user_usage', { p_user_id: user.id });

      if (error) throw error;

      if (data && data.length > 0) {
        setUsage(data[0]);
      } else {
        // If no subscription found, create a free plan subscription
        await createFreeSubscription();
      }
    } catch (err) {
      console.error('Error fetching usage:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const createFreeSubscription = async () => {
    try {
      // Get the free plan
      const { data: freePlan } = await supabase
        .from('subscription_plans')
        .select('id')
        .eq('name', 'free')
        .single();

      if (freePlan) {
        // Create a free subscription for the user
        const { error } = await supabase
          .from('user_subscriptions')
          .insert({
            user_id: user.id,
            plan_id: freePlan.id,
            status: 'active',
            billing_cycle: 'monthly',
            current_period_start: new Date().toISOString(),
            current_period_end: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
          });

        if (!error) {
          // Fetch usage again
          await fetchUsage();
        }
      }
    } catch (err) {
      console.error('Error creating free subscription:', err);
    }
  };

  const trackAIUsage = async (featureType, inputTokens, outputTokens, modelUsed = 'gpt-4', requestData = {}, responseData = {}) => {
    if (!user) return null;

    try {
      const { data, error } = await supabase
        .rpc('track_ai_usage', {
          p_user_id: user.id,
          p_feature_type: featureType,
          p_input_tokens: inputTokens,
          p_output_tokens: outputTokens,
          p_model_used: modelUsed,
          p_request_data: requestData,
          p_response_data: responseData
        });

      if (error) throw error;

      // Refresh usage data
      await fetchUsage();

      return data;
    } catch (err) {
      console.error('Error tracking AI usage:', err);
      throw err;
    }
  };

  const canUseAIFeature = async (featureType) => {
    if (!user) return false;

    try {
      const { data, error } = await supabase
        .rpc('can_use_ai_feature', {
          p_user_id: user.id,
          p_feature_type: featureType
        });

      if (error) throw error;

      return data;
    } catch (err) {
      console.error('Error checking AI feature availability:', err);
      return false;
    }
  };

  const getBillingHistory = async () => {
    if (!user) return [];

    try {
      const { data, error } = await supabase
        .from('billing_history')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;

      return data || [];
    } catch (err) {
      console.error('Error fetching billing history:', err);
      return [];
    }
  };

  const getUsageAlerts = async () => {
    if (!user) return [];

    try {
      const { data, error } = await supabase
        .from('usage_alerts')
        .select('*')
        .eq('user_id', user.id)
        .eq('is_read', false)
        .order('created_at', { ascending: false });

      if (error) throw error;

      return data || [];
    } catch (err) {
      console.error('Error fetching usage alerts:', err);
      return [];
    }
  };

  const markAlertAsRead = async (alertId) => {
    try {
      const { error } = await supabase
        .from('usage_alerts')
        .update({ 
          is_read: true, 
          read_at: new Date().toISOString() 
        })
        .eq('id', alertId);

      if (error) throw error;
    } catch (err) {
      console.error('Error marking alert as read:', err);
    }
  };

  const upgradePlan = async (planName, billingCycle = 'monthly') => {
    if (!user) return null;

    try {
      // Get the plan details
      const { data: plan } = await supabase
        .from('subscription_plans')
        .select('*')
        .eq('name', planName)
        .single();

      if (!plan) {
        throw new Error('Plan not found');
      }

      // Update user subscription
      const { data, error } = await supabase
        .from('user_subscriptions')
        .update({
          plan_id: plan.id,
          billing_cycle: billingCycle,
          current_period_start: new Date().toISOString(),
          current_period_end: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
          updated_at: new Date().toISOString()
        })
        .eq('user_id', user.id)
        .select()
        .single();

      if (error) throw error;

      // Refresh usage data
      await fetchUsage();

      return data;
    } catch (err) {
      console.error('Error upgrading plan:', err);
      throw err;
    }
  };

  useEffect(() => {
    fetchUsage();
  }, [user]);

  return {
    usage,
    loading,
    error,
    fetchUsage,
    trackAIUsage,
    canUseAIFeature,
    getBillingHistory,
    getUsageAlerts,
    markAlertAsRead,
    upgradePlan
  };
};

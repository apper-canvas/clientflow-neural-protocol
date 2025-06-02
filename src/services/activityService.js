import { toast } from 'react-toastify';

const TABLE_NAME = 'Activity1';

// Initialize ApperClient
const getApperClient = () => {
  const { ApperClient } = window.ApperSDK;
  return new ApperClient({
    apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
    apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
  });
};

// All fields available for this table (including System fields for fetch operations)
const ALL_FIELDS = [
  'Id', 'Name', 'Tags', 'Owner', 'CreatedOn', 'CreatedBy', 'ModifiedOn', 'ModifiedBy',
  'type', 'title', 'description', 'contact', 'deal', 'due_date', 'completed'
];

// Only updateable fields for create/update operations
const UPDATEABLE_FIELDS = [
  'Name', 'Tags', 'type', 'title', 'description', 'contact', 'deal', 'due_date', 'completed'
];

export const activityService = {
  // Fetch all activities
  async fetchActivities(params = {}) {
    try {
      const apperClient = getApperClient();
      
      const fetchParams = {
        fields: ALL_FIELDS,
        ...params
      };

      const response = await apperClient.fetchRecords(TABLE_NAME, fetchParams);
      
      if (!response || !response.data) {
        return [];
      }
      
      return response.data;
    } catch (error) {
      console.error('Error fetching activities:', error);
      toast.error('Failed to load activities');
      return [];
    }
  },

  // Get single activity by ID
  async getActivityById(activityId) {
    try {
      const apperClient = getApperClient();
      
      const params = {
        fields: ALL_FIELDS
      };

      const response = await apperClient.getRecordById(TABLE_NAME, activityId, params);
      
      if (!response || !response.data) {
        return null;
      }
      
      return response.data;
    } catch (error) {
      console.error(`Error fetching activity with ID ${activityId}:`, error);
      toast.error('Failed to load activity details');
      return null;
    }
  },

  // Create new activity
  async createActivity(activityData) {
    try {
      const apperClient = getApperClient();
      
      // Filter to only include updateable fields
      const filteredData = {};
      UPDATEABLE_FIELDS.forEach(field => {
        if (activityData[field] !== undefined && activityData[field] !== null && activityData[field] !== '') {
          filteredData[field] = activityData[field];
        }
      });

      // Ensure Name field is set (use title if available)
      if (!filteredData.Name && filteredData.title) {
        filteredData.Name = filteredData.title;
      }

      // Format date fields properly
      if (filteredData.due_date) {
        const date = new Date(filteredData.due_date);
        filteredData.due_date = date.toISOString().split('T')[0]; // YYYY-MM-DD format
      }

      // Handle boolean fields properly
      if (filteredData.completed !== undefined) {
        filteredData.completed = Boolean(filteredData.completed);
      }

      // Convert tags array to comma-separated string if needed
      if (Array.isArray(filteredData.Tags)) {
        filteredData.Tags = filteredData.Tags.join(',');
      }

      const params = {
        records: [filteredData]
      };

      const response = await apperClient.createRecord(TABLE_NAME, params);
      
      if (response && response.success && response.results && response.results[0]?.success) {
        toast.success('Activity created successfully');
        return response.results[0].data;
      } else {
        const errorMessage = response.results?.[0]?.message || 'Failed to create activity';
        toast.error(errorMessage);
        return null;
      }
    } catch (error) {
      console.error('Error creating activity:', error);
      toast.error('Failed to create activity');
      return null;
    }
  },

  // Update existing activity
  async updateActivity(activityId, activityData) {
    try {
      const apperClient = getApperClient();
      
      // Filter to only include updateable fields
      const filteredData = { Id: activityId };
      UPDATEABLE_FIELDS.forEach(field => {
        if (activityData[field] !== undefined) {
          filteredData[field] = activityData[field];
        }
      });

      // Format date fields properly
      if (filteredData.due_date) {
        const date = new Date(filteredData.due_date);
        filteredData.due_date = date.toISOString().split('T')[0]; // YYYY-MM-DD format
      }

      // Handle boolean fields properly
      if (filteredData.completed !== undefined) {
        filteredData.completed = Boolean(filteredData.completed);
      }

      // Convert tags array to comma-separated string if needed
      if (Array.isArray(filteredData.Tags)) {
        filteredData.Tags = filteredData.Tags.join(',');
      }

      const params = {
        records: [filteredData]
      };

      const response = await apperClient.updateRecord(TABLE_NAME, params);
      
      if (response && response.success && response.results && response.results[0]?.success) {
        toast.success('Activity updated successfully');
        return response.results[0].data;
      } else {
        const errorMessage = response.results?.[0]?.message || 'Failed to update activity';
        toast.error(errorMessage);
        return null;
      }
    } catch (error) {
      console.error('Error updating activity:', error);
      toast.error('Failed to update activity');
      return null;
    }
  },

  // Delete activity
  async deleteActivity(activityId) {
    try {
      const apperClient = getApperClient();
      
      const params = {
        RecordIds: [activityId]
      };

      const response = await apperClient.deleteRecord(TABLE_NAME, params);
      
      if (response && response.success && response.results && response.results[0]?.success) {
        toast.success('Activity deleted successfully');
        return true;
      } else {
        const errorMessage = response.results?.[0]?.message || 'Failed to delete activity';
        toast.error(errorMessage);
        return false;
      }
    } catch (error) {
      console.error('Error deleting activity:', error);
      toast.error('Failed to delete activity');
      return false;
    }
  },

  // Get activities by contact ID
  async getActivitiesByContact(contactId) {
    try {
      const apperClient = getApperClient();
      
      const params = {
        fields: ALL_FIELDS,
        where: [
          {
            fieldName: 'contact',
            operator: 'EqualTo',
            values: [contactId]
          }
        ]
      };

      const response = await apperClient.fetchRecords(TABLE_NAME, params);
      
      if (!response || !response.data) {
        return [];
      }
      
      return response.data;
    } catch (error) {
      console.error('Error fetching activities by contact:', error);
      toast.error('Failed to load contact activities');
      return [];
    }
  },

  // Get activities by deal ID
  async getActivitiesByDeal(dealId) {
    try {
      const apperClient = getApperClient();
      
      const params = {
        fields: ALL_FIELDS,
        where: [
          {
            fieldName: 'deal',
            operator: 'EqualTo',
            values: [dealId]
          }
        ]
      };

      const response = await apperClient.fetchRecords(TABLE_NAME, params);
      
      if (!response || !response.data) {
        return [];
      }
      
      return response.data;
    } catch (error) {
      console.error('Error fetching activities by deal:', error);
      toast.error('Failed to load deal activities');
      return [];
    }
  },

  // Mark activity as completed
  async markCompleted(activityId) {
    return this.updateActivity(activityId, { completed: true });
  },

  // Mark activity as incomplete
  async markIncomplete(activityId) {
    return this.updateActivity(activityId, { completed: false });
  }
};
import { toast } from 'react-toastify';

const TABLE_NAME = 'deal1';

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
  'title', 'value', 'stage', 'probability', 'expected_close_date', 'description', 'contact'
];

// Only updateable fields for create/update operations
const UPDATEABLE_FIELDS = [
  'Name', 'Tags', 'title', 'value', 'stage', 'probability', 'expected_close_date', 'description', 'contact'
];

export const dealService = {
  // Fetch all deals
  async fetchDeals(params = {}) {
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
      console.error('Error fetching deals:', error);
      toast.error('Failed to load deals');
      return [];
    }
  },

  // Get single deal by ID
  async getDealById(dealId) {
    try {
      const apperClient = getApperClient();
      
      const params = {
        fields: ALL_FIELDS
      };

      const response = await apperClient.getRecordById(TABLE_NAME, dealId, params);
      
      if (!response || !response.data) {
        return null;
      }
      
      return response.data;
    } catch (error) {
      console.error(`Error fetching deal with ID ${dealId}:`, error);
      toast.error('Failed to load deal details');
      return null;
    }
  },

  // Create new deal
  async createDeal(dealData) {
    try {
      const apperClient = getApperClient();
      
      // Filter to only include updateable fields
      const filteredData = {};
      UPDATEABLE_FIELDS.forEach(field => {
        if (dealData[field] !== undefined && dealData[field] !== null && dealData[field] !== '') {
          filteredData[field] = dealData[field];
        }
      });

      // Ensure Name field is set (use title if available)
      if (!filteredData.Name && filteredData.title) {
        filteredData.Name = filteredData.title;
      }

      // Format date fields properly
      if (filteredData.expected_close_date) {
        const date = new Date(filteredData.expected_close_date);
        filteredData.expected_close_date = date.toISOString().split('T')[0]; // YYYY-MM-DD format
      }

      // Ensure numeric fields are properly formatted
      if (filteredData.value) {
        filteredData.value = parseFloat(filteredData.value);
      }
      if (filteredData.probability) {
        filteredData.probability = parseInt(filteredData.probability);
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
        toast.success('Deal created successfully');
        return response.results[0].data;
      } else {
        const errorMessage = response.results?.[0]?.message || 'Failed to create deal';
        toast.error(errorMessage);
        return null;
      }
    } catch (error) {
      console.error('Error creating deal:', error);
      toast.error('Failed to create deal');
      return null;
    }
  },

  // Update existing deal
  async updateDeal(dealId, dealData) {
    try {
      const apperClient = getApperClient();
      
      // Filter to only include updateable fields
      const filteredData = { Id: dealId };
      UPDATEABLE_FIELDS.forEach(field => {
        if (dealData[field] !== undefined) {
          filteredData[field] = dealData[field];
        }
      });

      // Format date fields properly
      if (filteredData.expected_close_date) {
        const date = new Date(filteredData.expected_close_date);
        filteredData.expected_close_date = date.toISOString().split('T')[0]; // YYYY-MM-DD format
      }

      // Ensure numeric fields are properly formatted
      if (filteredData.value) {
        filteredData.value = parseFloat(filteredData.value);
      }
      if (filteredData.probability) {
        filteredData.probability = parseInt(filteredData.probability);
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
        toast.success('Deal updated successfully');
        return response.results[0].data;
      } else {
        const errorMessage = response.results?.[0]?.message || 'Failed to update deal';
        toast.error(errorMessage);
        return null;
      }
    } catch (error) {
      console.error('Error updating deal:', error);
      toast.error('Failed to update deal');
      return null;
    }
  },

  // Delete deal
  async deleteDeal(dealId) {
    try {
      const apperClient = getApperClient();
      
      const params = {
        RecordIds: [dealId]
      };

      const response = await apperClient.deleteRecord(TABLE_NAME, params);
      
      if (response && response.success && response.results && response.results[0]?.success) {
        toast.success('Deal deleted successfully');
        return true;
      } else {
        const errorMessage = response.results?.[0]?.message || 'Failed to delete deal';
        toast.error(errorMessage);
        return false;
      }
    } catch (error) {
      console.error('Error deleting deal:', error);
      toast.error('Failed to delete deal');
      return false;
    }
  },

  // Get deals by contact ID
  async getDealsByContact(contactId) {
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
      console.error('Error fetching deals by contact:', error);
      toast.error('Failed to load contact deals');
      return [];
    }
  }
};
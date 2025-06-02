import { toast } from 'react-toastify';

const TABLE_NAME = 'contact';

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
  'first_name', 'last_name', 'email', 'phone', 'company', 'position', 'last_contact_date'
];

// Only updateable fields for create/update operations
const UPDATEABLE_FIELDS = [
  'Name', 'Tags', 'first_name', 'last_name', 'email', 'phone', 'company', 'position', 'last_contact_date'
];

export const contactService = {
  // Fetch all contacts
  async fetchContacts(params = {}) {
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
      console.error('Error fetching contacts:', error);
      toast.error('Failed to load contacts');
      return [];
    }
  },

  // Get single contact by ID
  async getContactById(contactId) {
    try {
      const apperClient = getApperClient();
      
      const params = {
        fields: ALL_FIELDS
      };

      const response = await apperClient.getRecordById(TABLE_NAME, contactId, params);
      
      if (!response || !response.data) {
        return null;
      }
      
      return response.data;
    } catch (error) {
      console.error(`Error fetching contact with ID ${contactId}:`, error);
      toast.error('Failed to load contact details');
      return null;
    }
  },

  // Create new contact
  async createContact(contactData) {
    try {
      const apperClient = getApperClient();
      
      // Filter to only include updateable fields
      const filteredData = {};
      UPDATEABLE_FIELDS.forEach(field => {
        if (contactData[field] !== undefined && contactData[field] !== null && contactData[field] !== '') {
          filteredData[field] = contactData[field];
        }
      });

      // Ensure Name field is set (combine first_name and last_name if available)
      if (!filteredData.Name && (filteredData.first_name || filteredData.last_name)) {
        filteredData.Name = `${filteredData.first_name || ''} ${filteredData.last_name || ''}`.trim();
      }

      // Format date fields properly
      if (filteredData.last_contact_date) {
        const date = new Date(filteredData.last_contact_date);
        filteredData.last_contact_date = date.toISOString().split('T')[0]; // YYYY-MM-DD format
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
        toast.success('Contact created successfully');
        return response.results[0].data;
      } else {
        const errorMessage = response.results?.[0]?.message || 'Failed to create contact';
        toast.error(errorMessage);
        return null;
      }
    } catch (error) {
      console.error('Error creating contact:', error);
      toast.error('Failed to create contact');
      return null;
    }
  },

  // Update existing contact
  async updateContact(contactId, contactData) {
    try {
      const apperClient = getApperClient();
      
      // Filter to only include updateable fields
      const filteredData = { Id: contactId };
      UPDATEABLE_FIELDS.forEach(field => {
        if (contactData[field] !== undefined) {
          filteredData[field] = contactData[field];
        }
      });

      // Format date fields properly
      if (filteredData.last_contact_date) {
        const date = new Date(filteredData.last_contact_date);
        filteredData.last_contact_date = date.toISOString().split('T')[0]; // YYYY-MM-DD format
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
        toast.success('Contact updated successfully');
        return response.results[0].data;
      } else {
        const errorMessage = response.results?.[0]?.message || 'Failed to update contact';
        toast.error(errorMessage);
        return null;
      }
    } catch (error) {
      console.error('Error updating contact:', error);
      toast.error('Failed to update contact');
      return null;
    }
  },

  // Delete contact
  async deleteContact(contactId) {
    try {
      const apperClient = getApperClient();
      
      const params = {
        RecordIds: [contactId]
      };

      const response = await apperClient.deleteRecord(TABLE_NAME, params);
      
      if (response && response.success && response.results && response.results[0]?.success) {
        toast.success('Contact deleted successfully');
        return true;
      } else {
        const errorMessage = response.results?.[0]?.message || 'Failed to delete contact';
        toast.error(errorMessage);
        return false;
      }
    } catch (error) {
      console.error('Error deleting contact:', error);
      toast.error('Failed to delete contact');
      return false;
    }
  },

  // Search contacts
  async searchContacts(searchTerm) {
    try {
      const apperClient = getApperClient();
      
      const params = {
        fields: ALL_FIELDS,
        where: [
          {
            fieldName: 'Name',
            operator: 'Contains',
            values: [searchTerm]
          }
        ],
        whereGroups: [
          {
            operator: 'OR',
            subGroups: [
              {
                conditions: [
                  {
                    fieldName: 'email',
                    operator: 'Contains',
                    values: [searchTerm]
                  }
                ],
                operator: ''
              },
              {
                conditions: [
                  {
                    fieldName: 'company',
                    operator: 'Contains',
                    values: [searchTerm]
                  }
                ],
                operator: ''
              }
            ]
          }
        ]
      };

      const response = await apperClient.fetchRecords(TABLE_NAME, params);
      
      if (!response || !response.data) {
        return [];
      }
      
      return response.data;
    } catch (error) {
      console.error('Error searching contacts:', error);
      toast.error('Failed to search contacts');
      return [];
    }
  }
};
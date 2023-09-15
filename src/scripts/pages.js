exports.pagesAndFeatures = [
  {
    id: 1,
    name: 'Users',
    identifier: 'USERS',
    pages: [
      {
        id: 2,
        name: 'Users',
        identifier: 'USERS#USERS_TAB',
        pages: [],
        features: [
          {
            id: 1,
            name: 'List Users',
            page_id: 2,
            identifier: 'USERS#USERS_TAB#TAB_LIST_VIEW',
          },
          {
            id: 2,
            name: 'Add User',
            page_id: 2,
            identifier: 'USERS#USERS_TAB#ADD_USER',
          },
          {
            id: 3,
            name: 'Edit User',
            page_id: 2,
            identifier: 'USERS#USERS_TAB#EDIT_USER',
          },
        ],
        parent_id: 1,
      },
      {
        id: 3,
        name: 'Roles',
        identifier: 'USERS#ROLES_TAB',
        pages: [],
        features: [
          {
            id: 4,
            name: 'List Roles',
            page_id: 3,
            identifier: 'USERS#ROLES_TAB#TAB_LIST_VIEW',
          },
          {
            id: 5,
            name: 'Add Role',
            page_id: 3,
            identifier: 'USERS#ROLES_TAB#ADD_ROLE',
          },
        ],
        parent_id: 1,
      },
    ],
    features: [],
    parent_id: null,
  },
  {
    id: 4,
    name: 'Devices',
    identifier: 'DEVICES',
    pages: [
      {
        id: 5,
        name: 'Devices',
        identifier: 'DEVICES#DEVICES_TAB',
        pages: [
          {
            id: 6,
            name: 'Manage Privileges',
            identifier: 'DEVICES#DEVICES_TAB#MANAGE_PRIVILEGES',
            pages: [],
            features: [
              {
                id: 6,
                name: 'View Personality Privileges',
                page_id: 6,
                identifier:
                  'DEVICES#DEVICES_TAB#MANAGE_PRIVILEGES#VIEW_PRIVILEGES',
              },
              {
                id: 7,
                name: 'Add Privileges To personality',
                page_id: 6,
                identifier:
                  'DEVICES#DEVICES_TAB#MANAGE_PRIVILEGES#ADD_PRIVILEGES',
              },
              {
                id: 8,
                name: 'Edit Personality Privileges',
                page_id: 6,
                identifier:
                  'DEVICES#DEVICES_TAB#MANAGE_PRIVILEGES#EDIT_PRIVILEGES',
              },
            ],
            parent_id: 5,
          },
        ],
        features: [
          {
            id: 9,
            name: 'View List Device Types',
            page_id: 5,
            identifier: 'DEVICES#DEVICES_TAB#TAB_LIST_VIEW',
          },
          {
            id: 10,
            name: 'View List Devices',
            page_id: 5,
            identifier: 'DEVICES#DEVICES_TAB#VIEW_DEVICES',
          },
          {
            id: 11,
            name: 'Add Devices',
            page_id: 5,
            identifier: 'DEVICES#DEVICES_TAB#ADD_DEVICES',
          },
          {
            id: 12,
            name: 'Edit Devices',
            page_id: 5,
            identifier: 'DEVICES#DEVICES_TAB#EDIT_DEVICES',
          },
        ],
        parent_id: 4,
      },
    ],
    features: [],
    parent_id: null,
  },
  {
    id: 7,
    name: 'Inventory',
    identifier: 'INVENTORY',
    pages: [
      {
        id: 8,
        name: 'Inventory',
        identifier: 'INVENTORY#INVENTORY_TAB',
        pages: [],
        features: [
          {
            id: 13,
            name: 'View List Inventory',
            page_id: 8,
            identifier: 'INVENTORY#INVENTORY_TAB#TAB_LIST_VIEW',
          },
          {
            id: 14,
            name: 'Import CSV',
            page_id: 8,
            identifier: 'INVENTORY#INVENTORY_TAB#IMPORT_CSV',
          },
          {
            id: 15,
            name: 'CSV Import History',
            page_id: 8,
            identifier: 'INVENTORY#INVENTORY_TAB#IMPORT_HISTORY',
          },
        ],
        parent_id: 7,
      },
    ],
    features: [],
    parent_id: null,
  },
  {
    id: 9,
    name: 'Distributions',
    identifier: 'DISTRIBUTIONS',
    pages: [
      {
        id: 10,
        name: 'Distribution',
        identifier: 'DISTRIBUTIONS#DISTRIBUTIONS_TAB',
        pages: [],
        features: [
          {
            id: 16,
            name: 'View List Distribution',
            page_id: 10,
            identifier: 'DISTRIBUTIONS#DISTRIBUTIONS_TAB#TAB_LIST_VIEW',
          },
          {
            id: 17,
            name: 'Add Distribution',
            page_id: 10,
            identifier: 'DISTRIBUTIONS#DISTRIBUTIONS_TAB#ADD_DISTRIBUTION',
          },
          {
            id: 18,
            name: 'Edit Distribution',
            page_id: 10,
            identifier: 'DISTRIBUTIONS#DISTRIBUTIONS_TAB#EDIT_DISTRIBUTION',
          },
          {
            id: 19,
            name: 'Assign Devices',
            page_id: 10,
            identifier: 'DISTRIBUTIONS#DISTRIBUTIONS_TAB#ASSIGN_DEVICES',
          },
          {
            id: 20,
            name: 'View Devices',
            page_id: 10,
            identifier: 'DISTRIBUTIONS#DISTRIBUTIONS_TAB#VIEW_DEVICES',
          },
          {
            id: 21,
            name: 'Unassign Devices',
            page_id: 10,
            identifier: 'DISTRIBUTIONS#DISTRIBUTIONS_TAB#UNASSIGN_DEVICES',
          },
        ],
        parent_id: 9,
      },
    ],
    features: [],
    parent_id: null,
  },
];

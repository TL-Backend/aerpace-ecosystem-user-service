exports.pagesAndFeatures = [
  {
    id: 1,
    name: 'User Management Control',
    identifier: 'USERS_MANAGEMENT',
    pages: [
      {
        id: 2,
        name: 'Users',
        identifier: 'USERS_MANAGEMENT#USERS_TAB',
        pages: [],
        features: [
          {
            id: 1,
            name: 'List Users',
            page_id: 2,
            identifier: 'USERS_MANAGEMENT#USERS_TAB#TAB_LIST_VIEW',
          },
          {
            id: 2,
            name: 'Add User',
            page_id: 2,
            identifier: 'USERS_MANAGEMENT#USERS_TAB#ADD_USER',
          },
          {
            id: 3,
            name: 'Edit User',
            page_id: 2,
            identifier: 'USERS_MANAGEMENT#USERS_TAB#EDIT_USER',
          },
        ],
        parent_id: 1,
      },
      {
        id: 3,
        name: 'Roles',
        identifier: 'USERS_MANAGEMENT#ROLES_TAB',
        pages: [],
        features: [
          {
            id: 4,
            name: 'List Roles',
            page_id: 3,
            identifier: 'USERS_MANAGEMENT#ROLES_TAB#TAB_LIST_VIEW',
          },
          {
            id: 5,
            name: 'Add Role',
            page_id: 3,
            identifier: 'USERS_MANAGEMENT#ROLES_TAB#ADD_ROLE',
          },
          {
            id: 6,
            name: 'Edit Role',
            page_id: 3,
            identifier: 'USERS_MANAGEMENT#ROLES_TAB#EDIT_ROLE',
          },
          {
            id: 7,
            name: 'Delete Role',
            page_id: 3,
            identifier: 'USERS_MANAGEMENT#ROLES_TAB#DELETE_ROLE',
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
    name: 'Device Management Control',
    identifier: 'DEVICES_MANAGEMENT',
    pages: [
      {
        id: 5,
        name: 'Cars',
        identifier: 'DEVICES_MANAGEMENT#CAR_TAB',
        pages: [],
        features: [
          {
            id: 8,
            name: 'View List Car Types',
            page_id: 5,
            identifier: 'DEVICES_MANAGEMENT#CAR_TAB#TAB_LIST_VIEW',
          },
          {
            id: 9,
            name: 'View List Cars',
            page_id: 5,
            identifier: 'DEVICES_MANAGEMENT#CAR_TAB#VIEW_CAR',
          },
          {
            id: 10,
            name: 'Add Car',
            page_id: 5,
            identifier: 'DEVICES_MANAGEMENT#CAR_TAB#ADD_CAR',
          },
          {
            id: 11,
            name: 'Edit Car',
            page_id: 5,
            identifier: 'DEVICES_MANAGEMENT#CAR_TAB#EDIT_CAR',
          },
          {
            id: 12,
            name: 'Delete Car',
            page_id: 5,
            identifier: 'DEVICES_MANAGEMENT#CAR_TAB#DELETE_CAR',
          },
        ],
        parent_id: 4,
      },
      {
        id: 6,
        name: 'Manage Privileges',
        identifier: 'DEVICES_MANAGEMENT#MANAGE_PRIVILEGES',
        pages: [],
        features: [
          {
            id: 13,
            name: 'View Personality Privileges',
            page_id: 6,
            identifier: 'DEVICES_MANAGEMENT#MANAGE_PRIVILEGES#VIEW_PRIVILEGES',
          },
          {
            id: 14,
            name: 'Add Privileges To personality',
            page_id: 6,
            identifier: 'DEVICES_MANAGEMENT#MANAGE_PRIVILEGES#ADD_PRIVILEGES',
          },
          {
            id: 15,
            name: 'Edit Personality Privileges',
            page_id: 6,
            identifier: 'DEVICES_MANAGEMENT#MANAGE_PRIVILEGES#EDIT_PRIVILEGES',
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
    name: 'Inventory management control',
    identifier: 'INVENTORY_MANAGEMENT',
    pages: [],
    features: [
      {
        id: 16,
        name: 'View List Inventory',
        page_id: 7,
        identifier: 'INVENTORY_MANAGEMENT#TAB_LIST_VIEW',
      },
      {
        id: 17,
        name: 'Import CSV',
        page_id: 7,
        identifier: 'INVENTORY_MANAGEMENT#IMPORT_CSV',
      },
      {
        id: 18,
        name: 'CSV Import History',
        page_id: 7,
        identifier: 'INVENTORY_MANAGEMENT#IMPORT_HISTORY',
      },
    ],
    parent_id: null,
  },
  {
    id: 8,
    name: 'Distribution management control',
    identifier: 'DISTRIBUTIONS_MANAGEMENT',
    pages: [],
    features: [
      {
        id: 19,
        name: 'View List Distribution',
        page_id: 8,
        identifier: 'DISTRIBUTIONS_MANAGEMENT#TAB_LIST_VIEW',
      },
      {
        id: 20,
        name: 'Add Distribution',
        page_id: 8,
        identifier: 'DISTRIBUTIONS_MANAGEMENT#ADD_DISTRIBUTION',
      },
      {
        id: 21,
        name: 'Edit Distribution',
        page_id: 8,
        identifier: 'DISTRIBUTIONS_MANAGEMENT#EDIT_DISTRIBUTION',
      },
      {
        id: 22,
        name: 'Assign Devices',
        page_id: 8,
        identifier: 'DISTRIBUTIONS_MANAGEMENT#ASSIGN_DEVICES',
      },
      {
        id: 23,
        name: 'Unassign Devices',
        page_id: 8,
        identifier: 'DISTRIBUTIONS_MANAGEMENT#UNASSIGN_DEVICES',
      },
    ],
    parent_id: null,
  },
];

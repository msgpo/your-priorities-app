'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return [
      await queryInterface.createTable(
        'videos',
        {
          id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
          },
          created_at: {
            type: Sequelize.DATE
          },
          updated_at: {
            type: Sequelize.DATE
          },
          name: Sequelize.STRING,
          description: Sequelize.TEXT,
          meta: Sequelize.JSONB,
          formats: Sequelize.JSONB,
          user_id: { type: Sequelize.INTEGER, allowNull: false },
          viewable: { type: Sequelize.BOOLEAN, allowNull: false, defaultValue: false },
          ip_address: { type: Sequelize.STRING, allowNull: false },
          user_agent: { type: Sequelize.TEXT, allowNull: false },
          deleted: { type: Sequelize.BOOLEAN, allowNull: false, defaultValue: false }
        }
      ),
      await queryInterface.addIndex('videos', {
        fields: ['meta'],
        using: 'gin',
        operator: 'jsonb_path_ops',
        name: 'videos_meta_index'
      }),
      await queryInterface.addIndex('videos', {
        fields: ['formats'],
        using: 'gin',
        operator: 'jsonb_path_ops',
        name: 'videos_formats_index',
      }),
      await queryInterface.addIndex('videos', ['user_id', 'viewable', 'deleted']),
      await queryInterface.createTable(
        'post_videos',
        {
          id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
          },
          created_at: {
            type: Sequelize.DATE
          },
          updated_at: {
            type: Sequelize.DATE
          },
          videoId: {
            type: Sequelize.INTEGER,
            references: {
              model: 'videos',
              key: 'id'
            },
          },
          postId: {
            type: Sequelize.INTEGER,
            references: {
              model: 'posts',
              key: 'id'
            },
          },
        }
      ),
      await queryInterface.createTable(
        'point_videos',
        {
          id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
          },
          created_at: {
            type: Sequelize.DATE
          },
          updated_at: {
            type: Sequelize.DATE
          },
          videoId: {
            type: Sequelize.INTEGER,
            references: {
              model: 'videos',
              key: 'id'
            },
          },
          pointId: {
            type: Sequelize.INTEGER,
            references: {
              model: 'points',
              key: 'id'
            },
          },
        }
      ),
      await queryInterface.createTable(
        'user_profile_videos',
        {
          id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
          },
          created_at: {
            type: Sequelize.DATE
          },
          updated_at: {
            type: Sequelize.DATE
          },
          videoId: {
            type: Sequelize.INTEGER,
            references: {
              model: 'videos',
              key: 'id'
            },
          },
          userId: {
            type: Sequelize.INTEGER,
            references: {
              model: 'users',
              key: 'id'
            },
          },
        }
      ),
      await queryInterface.createTable(
        'community_logo_videos',
        {
          id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
          },
          created_at: {
            type: Sequelize.DATE
          },
          updated_at: {
            type: Sequelize.DATE
          },
          videoId: {
            type: Sequelize.INTEGER,
            references: {
              model: 'videos',
              key: 'id'
            },
          },
          communityId: {
            type: Sequelize.INTEGER,
            references: {
              model: 'communities',
              key: 'id'
            },
          },
        }
      ),
      await queryInterface.createTable(
        'group_logo_videos',
        {
          id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
          },
          created_at: {
            type: Sequelize.DATE
          },
          updated_at: {
            type: Sequelize.DATE
          },
          videoId: {
            type: Sequelize.INTEGER,
            references: {
              model: 'videos',
              key: 'id'
            },
          },
          groupId: {
            type: Sequelize.INTEGER,
            references: {
              model: 'groups',
              key: 'id'
            },
          },
        }
      ),
      await queryInterface.createTable(
        'domain_logo_videos',
        {
          id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
          },
          created_at: {
            type: Sequelize.DATE
          },
          updated_at: {
            type: Sequelize.DATE
          },
          videoId: {
            type: Sequelize.INTEGER,
            references: {
              model: 'videos',
              key: 'id'
            },
          },
          domainId: {
            type: Sequelize.INTEGER,
            references: {
              model: 'domains',
              key: 'id'
            },
          },
        }
      ),
    ]
  },

  down: function (queryInterface, Sequelize) {
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.dropTable('users');
    */
  }
};

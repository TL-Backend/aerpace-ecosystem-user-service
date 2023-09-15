const { pagesAndFeatures } = require('./pages');
const {
  sequelize,
  aergov_page_features,
  aergov_portal_pages,
} = require('../services/aerpace-ecosystem-backend-db/src/databases/postgresql/models');
const { logger } = require('../utils/logger');

const flattenPagesAndFeatures = (pages, pagesArray, featuresArray) => {
  try {
    pages?.forEach((page) => {
      if (page) {
        if (page.pages) {
          flattenPagesAndFeatures(page.pages, pagesArray, featuresArray);
        }
        pagesArray.push({
          id: page.id,
          name: page.name,
          identifier: page.identifier,
          parent_id: page.parent_id,
        });
        if (page.features) {
          page.features.forEach((feature) => {
            featuresArray.push(feature);
          });
        }
      }
    });
  } catch (err) {
    logger.error(err);
    return err;
  }
};

const extractPagesAndFeatures = (pagesAndFeatures) => {
  try {
    const pages = [];
    const features = [];

    flattenPagesAndFeatures(pagesAndFeatures, pages, features);

    return { pages, features };
  } catch (err) {
    logger.error(err);
    return err;
  }
};

const masterPagesAndFeaturesDump = async ({ pagesAndFeatures }) => {
  const transaction = await sequelize.transaction();
  try {
    const { pages, features } = extractPagesAndFeatures(pagesAndFeatures);

    if (pages.length > 0 && features.length > 0) {
      await aergov_portal_pages.destroy({ truncate: true });
      await aergov_page_features.destroy({ truncate: true });
      await aergov_portal_pages.bulkCreate(pages);
      await aergov_page_features.bulkCreate(features);

      await transaction.commit();
      return;
    }

    await transaction.rollback();
    return;
  } catch (err) {
    await transaction.rollback();
    logger.error(err);
    return err;
  }
};

masterPagesAndFeaturesDump({ pagesAndFeatures });

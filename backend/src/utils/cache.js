const NodeCache = require("node-cache");

const cache = new NodeCache({
  stdTTL: 300, // 5 minutes default
  checkperiod: 60, // expired keys cleanup every 60 sec
  useClones: true,
});

const CACHE_KEYS = {
  user: (userId) => `user:${userId}`,
  userProjects: (userId) => `projects:user:${userId}`,
  project: (projectId) => `project:${projectId}`,
};

const invalidateUser = (userId) => {
  cache.del(CACHE_KEYS.user(userId));
};

const invalidateUserProjects = (userId) => {
  cache.del(CACHE_KEYS.userProjects(userId));
};

const invalidateProject = (projectId) => {
  cache.del(CACHE_KEYS.project(projectId));
};

const invalidateProjectAndUser = (projectId, userId) => {
  cache.del(CACHE_KEYS.project(projectId));
  cache.del(CACHE_KEYS.userProjects(userId));
};

module.exports = {
  cache,
  CACHE_KEYS,
  invalidateUser,
  invalidateUserProjects,
  invalidateProject,
  invalidateProjectAndUser,
};
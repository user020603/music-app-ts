import { Express } from "express";
import { dashboardRoutes } from "./dashboard.route";
import { topicRoutes } from "./topic.route";
import { systemConfig } from "../../config/system";

const adminRoutes = (app: Express): void => {
  const prefixAdmin = systemConfig.prefixAdmin;

  app.use(`/${prefixAdmin}/dashboard`, dashboardRoutes);

  app.use(`/${prefixAdmin}/topics`, topicRoutes);
};

export default adminRoutes;



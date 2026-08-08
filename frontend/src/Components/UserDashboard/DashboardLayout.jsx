import React from "react";
import { motion } from "framer-motion";
import { Outlet } from "react-router-dom";
import {
  useQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";

import Topbar from "./HeadersDashboard/Topbar";
import FirstTimeInstruction from "../Pages/FirstTimeInstruction";
import DecryptData from "./Setting/DecryptData";

const DashboardLayout = () => {
  const electricaURL = import.meta.env.VITE_ELECTRICA_API_URL;
  const queryClient = useQueryClient();

  // -------------------------
  // Fetch User
  // -------------------------
  const {
    data: user = {},
    isLoading: isUserLoading,
  } = useQuery({
    queryKey: ["user"],
    queryFn: async () => {
      const response = await fetch(
        `${electricaURL}/api/auth/user-info`,
        {
          credentials: "include",
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch user");
      }

      const data = await response.json();

      if (!data.encryptedData) {
        return {
          user: {},
          isFirstTime: false,
        };
      }

      return {
        user: DecryptData(data.encryptedData),
        isFirstTime: data.isFirstTime,
      };
    },

    staleTime: 5 * 60 * 1000,
  });

  // -------------------------
  // Fetch Projects
  // -------------------------
  const {
    data: projects = [],
    isLoading: isProjectsLoading,
  } = useQuery({
    queryKey: ["projects"],
    queryFn: async () => {
      const response = await fetch(
        `${electricaURL}/api/auth/project-details`,
        {
          credentials: "include",
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch projects");
      }

      const data = await response.json();

      if (!data.encryptedData) {
        return [];
      }

      return DecryptData(data.encryptedData);
    },

    staleTime: 5 * 60 * 1000,
  });

  // -------------------------
  // Complete Onboarding
  // -------------------------
  const completeOnboardingMutation = useMutation({
    mutationFn: async () => {
      const response = await fetch(
        `${electricaURL}/api/auth/updateFirstTime`,
        {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update onboarding status");
      }

      return response.json();
    },

    onSuccess: () => {
      queryClient.setQueryData(["user"], (oldData) => {
        if (!oldData) return oldData;

        return {
          ...oldData,
          isFirstTime: false,
        };
      });
    },
  });

  // -------------------------
  // Loading
  // -------------------------
  if (isUserLoading || isProjectsLoading) {
    return null;
  }

  const isFirstTimeUser = user?.isFirstTime;

  return (
    <>
      {isFirstTimeUser ? (
        <FirstTimeInstruction
          onComplete={() => completeOnboardingMutation.mutate()}
        />
      ) : (
        <>
          <Topbar />

          <motion.div
            key="main-content"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Outlet
              context={{
                user: user?.user,
                projects,
                electricaURL,
              }}
            />
          </motion.div>
        </>
      )}
    </>
  );
};

export default DashboardLayout;
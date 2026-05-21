import React, { useState } from "react";
import { Outlet, useLocation, useNavigate } from "react-router";
import '../styles/mobile-nav.css';
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import Task_drawer from "./Navbar/Task_drawer";
import Add_New_Task from "./Navbar/Add_New_Task";
import Edit_Task from "./Navbar/Edit_Task";

const Layout: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isTaskDrawerOpen, setIsTaskDrawerOpen] = useState(false);
  const [showAddTask, setShowAddTask] = useState(false);
  const [showEditTask, setShowEditTask] = useState(false);
  const [editingTaskData, setEditingTaskData] = useState<any>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Extract the current page from the pathname for the Sidebar active state
  const currentPath = location.pathname.substring(1) || "overview";

  return (
    <div style={{ display: "flex", width: "100vw", height: "100vh", overflow: "hidden" }}>
      {/* Sidebar on the left */}
      <div className="layout-sidebar">
        <Sidebar
        currentPage={currentPath}
        onNavigate={(page) => {
          if (page === "logout") {
            console.log("Logout clicked");
          } else if (page === "overview") {
            navigate("/");
          } else {
            navigate(`/${page}`);
          }
        }}
      />
      </div>

      {/* Main content area */}
      <div className="layout-main" style={{ flex: 1, display: "flex", flexDirection: "column", position: "relative", backgroundColor: "#F5F6FA" }}>
        <div style={{ position: "relative", zIndex: 10 }}>
          <Navbar onTasksClick={() => setIsTaskDrawerOpen(true)} onMenuClick={() => setIsMobileMenuOpen(true)} />
        </div>

        {/* Scrollable page content */}
        <div
          className="layout-content"
          style={{
            flex: 1,
            overflowY: "auto",
            marginTop: 88,
            padding: "32px 24px",
          }}
        >
          <Outlet />
        </div>
      </div>

      {/* ── Task Drawer Overlay ── */}
      {isTaskDrawerOpen && (
        <div
          onClick={() => setIsTaskDrawerOpen(false)}
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0, 0, 0, 0.25)",
            zIndex: 100,
          }}
        />
      )}

      {/* ── Task Drawer (slides in from right) ── */}
      <div
        style={{
          position: "fixed",
          top: 0,
          right: 0,
          height: "100vh",
          zIndex: 101,
          transform: isTaskDrawerOpen ? "translateX(0)" : "translateX(100%)",
          transition: "transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
          willChange: "transform",
        }}
      >
        <Task_drawer
          onClose={() => setIsTaskDrawerOpen(false)}
          onNewTask={() => {
            setIsTaskDrawerOpen(false);
            setShowAddTask(true);
          }}
          onEditTask={(taskData) => {
            setEditingTaskData(taskData);
            setIsTaskDrawerOpen(false);
            setShowEditTask(true);
          }}
        />
      </div>

      {/* ── Add New Task Modal (centered) ── */}
      {showAddTask && (
        <>
          <div
            onClick={() => setShowAddTask(false)}
            style={{
              position: "fixed",
              inset: 0,
              background: "rgba(0, 0, 0, 0.35)",
              zIndex: 200,
            }}
          />
          <div
            style={{
              position: "fixed",
              inset: 0,
              zIndex: 201,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              pointerEvents: "none",
            }}
          >
            <div style={{ pointerEvents: "auto", maxHeight: "90vh", overflowY: "auto", borderRadius: 12 }}>
              <Add_New_Task
                onClose={() => setShowAddTask(false)}
                onSave={(data) => {
                  console.log("New task saved:", data);
                  setShowAddTask(false);
                }}
              />
            </div>
          </div>
        </>
      )}

      {/* ── Edit Task Modal (centered) ── */}
      {showEditTask && (
        <>
          <div
            onClick={() => setShowEditTask(false)}
            style={{
              position: "fixed",
              inset: 0,
              background: "rgba(0, 0, 0, 0.35)",
              zIndex: 200,
            }}
          />
          <div
            style={{
              position: "fixed",
              inset: 0,
              zIndex: 201,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              pointerEvents: "none",
            }}
          >
            <div style={{ pointerEvents: "auto", maxHeight: "90vh", overflowY: "auto", borderRadius: 12 }}>
              <Edit_Task
                initialData={editingTaskData}
                onClose={() => setShowEditTask(false)}
                onSave={(data) => {
                  console.log("Task edited:", data);
                  setShowEditTask(false);
                }}
              />
            </div>
          </div>
        </>
      )}

      {/* ── Mobile Sidebar Overlay ── */}
      <div 
        className={`mobile-sidebar-backdrop ${isMobileMenuOpen ? 'open' : ''}`}
        onClick={() => setIsMobileMenuOpen(false)}
      />

      {/* ── Mobile Sidebar Drawer ── */}
      <div className={`mobile-sidebar-drawer ${isMobileMenuOpen ? 'open' : ''}`}>
        <div style={{ height: "100%", width: 94 }}>
          <Sidebar
            currentPage={currentPath}
            onNavigate={(page) => {
              setIsMobileMenuOpen(false);
              if (page === "logout") {
                console.log("Logout clicked");
              } else if (page === "overview") {
                navigate("/");
              } else {
                navigate(`/${page}`);
              }
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default Layout;

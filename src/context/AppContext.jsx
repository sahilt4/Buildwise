import React, { createContext, useContext, useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import {
  initialSites,
  initialMaterials,
  initialLeftovers,
  initialMarketplace,
  initialWorkers,
  initialTasks,
  initialActivities,
  initialAttendanceLogs
} from '../data/mockData';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [sites, setSites] = useState(() => {
    const saved = localStorage.getItem('bw_sites');
    return saved ? JSON.parse(saved) : initialSites;
  });

  const [materials, setMaterials] = useState(() => {
    const saved = localStorage.getItem('bw_materials');
    return saved ? JSON.parse(saved) : initialMaterials;
  });

  const [leftovers, setLeftovers] = useState(() => {
    const saved = localStorage.getItem('bw_leftovers');
    return saved ? JSON.parse(saved) : initialLeftovers;
  });

  const [marketplace, setMarketplace] = useState(() => {
    const saved = localStorage.getItem('bw_marketplace');
    return saved ? JSON.parse(saved) : initialMarketplace;
  });

  const [workers, setWorkers] = useState(() => {
    const saved = localStorage.getItem('bw_workers');
    return saved ? JSON.parse(saved) : initialWorkers;
  });

  const [tasks, setTasks] = useState(() => {
    const saved = localStorage.getItem('bw_tasks');
    return saved ? JSON.parse(saved) : initialTasks;
  });

  const [activities, setActivities] = useState(() => {
    const saved = localStorage.getItem('bw_activities');
    return saved ? JSON.parse(saved) : initialActivities;
  });

  const [attendanceLogs, setAttendanceLogs] = useState(() => {
    const saved = localStorage.getItem('bw_attendance');
    return saved ? JSON.parse(saved) : initialAttendanceLogs;
  });

  const [userRole, setUserRole] = useState('builder'); // 'builder' | 'engineer' | 'worker'
  const [activeView, setActiveView] = useState('dashboard');
  const [isLandingPage, setIsLandingPage] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [toasts, setToasts] = useState([]);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [undoStack, setUndoStack] = useState([]);

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem('bw_sites', JSON.stringify(sites));
  }, [sites]);
  useEffect(() => {
    localStorage.setItem('bw_materials', JSON.stringify(materials));
  }, [materials]);
  useEffect(() => {
    localStorage.setItem('bw_leftovers', JSON.stringify(leftovers));
  }, [leftovers]);
  useEffect(() => {
    localStorage.setItem('bw_marketplace', JSON.stringify(marketplace));
  }, [marketplace]);
  useEffect(() => {
    localStorage.setItem('bw_workers', JSON.stringify(workers));
  }, [workers]);
  useEffect(() => {
    localStorage.setItem('bw_tasks', JSON.stringify(tasks));
  }, [tasks]);
  useEffect(() => {
    localStorage.setItem('bw_activities', JSON.stringify(activities));
  }, [activities]);
  useEffect(() => {
    localStorage.setItem('bw_attendance', JSON.stringify(attendanceLogs));
  }, [attendanceLogs]);

  // Toast dispatch
  const addToast = (message, type = 'success') => {
    const id = Date.now() + Math.random();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      removeToast(id);
    }, 4000);
  };

  const removeToast = (id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  const triggerConfetti = () => {
    try {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.8 },
        colors: ['#f59e0b', '#10b981', '#0f172a']
      });
    } catch (e) {
      // fallback if canvas not available
    }
  };

  // Add Activity Helper
  const logActivity = (text, type = 'general', statusClass = 'info') => {
    const newAct = {
      id: 'act-' + Date.now(),
      text,
      time: 'Just now',
      type,
      statusClass
    };
    setActivities(prev => [newAct, ...prev.slice(0, 15)]);
  };

  // Action Handlers
  const addMaterial = (newMat) => {
    const mat = {
      ...newMat,
      id: 'mat-' + Date.now(),
      purchased: Number(newMat.purchased),
      used: Number(newMat.used || 0),
      remaining: Number(newMat.purchased) - Number(newMat.used || 0),
      lastUpdated: 'Just now',
      status: (Number(newMat.purchased) - Number(newMat.used || 0)) <= Number(newMat.threshold || 50) ? 'Low Stock' : 'In Stock'
    };
    setMaterials(prev => [mat, ...prev]);
    logActivity(`Added ${mat.name} (${mat.purchased} ${mat.unit}) to ${mat.siteName}`, 'material', 'success');
    addToast(`✓ Material "${mat.name}" added successfully`, 'success');
  };

  const recordUsage = (matId, usedQty) => {
    const prevMat = materials.find(m => m.id === matId);
    if (!prevMat) return;

    // Push the previous state of this material to the undo stack
    setUndoStack(prev => [...prev, { type: 'MATERIAL_USAGE', prevState: { ...prevMat } }]);

    const newUsed = Number(prevMat.used) + Number(usedQty);
    const newRemaining = Math.max(0, Number(prevMat.purchased) - newUsed);
    let newStatus = newRemaining <= Number(prevMat.threshold || 50) ? 'Low Stock' : 'In Stock';
    let isSurplus = false;

    // Waste-to-Value Classifier Rule
    if (prevMat.required && newRemaining > prevMat.required && prevMat.condition && prevMat.condition !== 'Scrap') {
      newStatus = 'Surplus Candidate';
      isSurplus = true;
    }

    setMaterials(prev => prev.map(m => {
      if (m.id === matId) {
        return {
          ...m,
          used: newUsed,
          remaining: newRemaining,
          status: newStatus,
          lastUpdated: 'Just now'
        };
      }
      return m;
    }));

    if (isSurplus) {
      const surplusQty = newRemaining - prevMat.required;
      const conditionFactor = prevMat.condition === 'Brand New' ? 0.8 : 0.6;
      const estValue = surplusQty * (prevMat.costPerUnit || 100) * conditionFactor;
      
      setLeftovers(prev => {
        if (prev.some(l => l.materialId === matId)) return prev;
        return [{
          id: 'left-' + Date.now(),
          materialId: matId,
          title: prevMat.name,
          quantity: surplusQty + ' ' + prevMat.unit,
          estimatedValue: estValue,
          site: prevMat.siteName,
          condition: prevMat.condition,
          category: prevMat.category,
          image: prevMat.image,
          description: 'Automatically flagged surplus based on site requirements.'
        }, ...prev];
      });
      addToast(`💡 Identified surplus ${prevMat.name}! Added to Waste-to-Value.`, 'info');
    }

    logActivity(`Recorded usage of ${usedQty} ${prevMat.unit} of ${prevMat.name}`, 'material', 'info');
    addToast(`✓ Recorded ${usedQty} ${prevMat.unit} usage for ${prevMat.name}`, 'success');
  };

  const undoLastAction = () => {
    if (undoStack.length === 0) return;
    
    // Pop top action
    const newStack = [...undoStack];
    const lastAction = newStack.pop();
    setUndoStack(newStack);

    if (lastAction.type === 'MATERIAL_USAGE') {
      const prev = lastAction.prevState;
      setMaterials(currentMaterials => 
        currentMaterials.map(m => (m.id === prev.id ? prev : m))
      );
      addToast(`Reverted usage entry for ${prev.name}`, 'info');
    }
  };

  // Waste -> Value: 1-Click Sell Leftover to Marketplace
  const listLeftoverOnMarketplace = (leftoverId) => {
    const item = leftovers.find(l => l.id === leftoverId);
    if (!item) return;

    const newMarketListing = {
      id: 'mkt-' + Date.now(),
      title: item.title,
      quantity: item.quantity,
      price: Math.round(item.estimatedValue / (parseInt(item.quantity) || 1)),
      unit: item.quantity.includes('piece') ? 'piece' : (item.quantity.includes('Ton') ? 'ton' : 'unit'),
      totalPrice: item.estimatedValue,
      location: item.site + ', Nashik',
      city: 'Nashik',
      condition: item.condition,
      seller: 'Rajesh Infra (Direct)',
      sellerRating: 5.0,
      category: item.category,
      image: item.image,
      postedTime: 'Just now',
      verifiedSeller: true
    };

    setMarketplace(prev => [newMarketListing, ...prev]);
    setLeftovers(prev => prev.filter(l => l.id !== leftoverId));
    logActivity(`Listed leftover ${item.title} (${item.quantity}) on Marketplace for ₹${item.estimatedValue.toLocaleString()}`, 'marketplace', 'success');
    triggerConfetti();
    addToast(`🎉 Value Recovered! Listed ${item.title} on Marketplace for ₹${item.estimatedValue.toLocaleString()}`, 'success');
  };

  const addMarketplaceListing = (listing) => {
    const newListing = {
      ...listing,
      id: 'mkt-' + Date.now(),
      postedTime: 'Just now',
      seller: 'Buildwise Verified User',
      sellerRating: 5.0,
      verifiedSeller: true
    };
    setMarketplace(prev => [newListing, ...prev]);
    logActivity(`Created marketplace listing for ${listing.title}`, 'marketplace', 'success');
    triggerConfetti();
    addToast(`✓ Listing "${listing.title}" published to marketplace`, 'success');
  };

  const requestMarketplaceItem = (itemTitle, sellerName) => {
    logActivity(`Sent purchase request to ${sellerName} for ${itemTitle}`, 'marketplace', 'info');
    addToast(`✓ Request sent to ${sellerName}. They will contact you shortly!`, 'success');
  };

  const addWorker = (workerData) => {
    const newWorker = {
      ...workerData,
      id: 'w-' + Date.now(),
      attendanceRate: 100,
      status: 'Active',
      isCheckedIn: false,
      checkInTime: null,
      avatar: workerData.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'
    };
    setWorkers(prev => [newWorker, ...prev]);
    logActivity(`Added crew member ${newWorker.name} (${newWorker.trade}) to ${newWorker.siteName}`, 'worker', 'success');
    addToast(`✓ Worker "${newWorker.name}" added successfully`, 'success');
  };

  const createTask = (taskData) => {
    const newTask = {
      ...taskData,
      id: 'task-' + Date.now(),
      progress: 0,
      status: 'To Do'
    };
    setTasks(prev => [newTask, ...prev]);
    logActivity(`Assigned task "${newTask.title}" to ${newTask.workerName}`, 'task', 'info');
    addToast(`✓ Task "${newTask.title}" created`, 'success');
  };

  const updateTaskStatus = (taskId, newStatus, newProgress) => {
    let isBlocked = false;

    setTasks(prev => {
      // Find the task to check DAG prerequisite
      const task = prev.find(t => t.id === taskId);
      if (task && task.prerequisiteId && newStatus === 'In Progress') {
        const prereqTask = prev.find(t => t.id === task.prerequisiteId);
        if (prereqTask && prereqTask.status !== 'Completed') {
          isBlocked = true;
          addToast(`Blocked! Prerequisite "${prereqTask.title}" must be completed first.`, 'danger');
          return prev;
        }
      }

      return prev.map(t => {
        if (t.id === taskId) {
          const progress = newProgress !== undefined ? newProgress : (newStatus === 'Completed' ? 100 : t.progress);
          return { ...t, status: newStatus, progress };
        }
        return t;
      });
    });

    if (!isBlocked) {
      if (newStatus === 'Completed') {
        triggerConfetti();
        addToast(`🎉 Task marked as completed!`, 'success');
      } else {
        addToast(`✓ Task updated to ${newStatus}`, 'info');
      }
    }
  };

  // 1-Click Worker Attendance Check-in / Check-out
  const toggleWorkerAttendance = (workerId) => {
    const now = new Date();
    const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true });

    let updatedWorker = null;
    setWorkers(prev => prev.map(w => {
      if (w.id === workerId) {
        const newCheckedState = !w.isCheckedIn;
        updatedWorker = {
          ...w,
          isCheckedIn: newCheckedState,
          checkInTime: newCheckedState ? timeStr : null
        };
        return updatedWorker;
      }
      return w;
    }));

    if (updatedWorker) {
      if (updatedWorker.isCheckedIn) {
        triggerConfetti();
        addToast(`✓ Checked in successfully at ${timeStr}`, 'success');
        logActivity(`${updatedWorker.name} checked in at ${updatedWorker.siteName}`, 'attendance', 'success');
        setAttendanceLogs(prev => [
          {
            id: 'att-' + Date.now(),
            workerName: updatedWorker.name,
            trade: updatedWorker.trade,
            siteName: updatedWorker.siteName,
            time: timeStr,
            date: 'Today',
            status: 'Present',
            method: '1-Click Mobile Punch'
          },
          ...prev
        ]);
      } else {
        addToast(`✓ Checked out at ${timeStr}`, 'info');
        logActivity(`${updatedWorker.name} checked out from ${updatedWorker.siteName}`, 'attendance', 'info');
      }
    }
  };

  // QR Code Attendance scan
  const scanQRAttendance = (siteName) => {
    const now = new Date();
    const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true });

    // Mark current worker as checked in
    setWorkers(prev => prev.map(w => {
      if (w.id === 'w-1') {
        return {
          ...w,
          isCheckedIn: true,
          checkInTime: timeStr,
          siteName: siteName || w.siteName
        };
      }
      return w;
    }));

    setAttendanceLogs(prev => [
      {
        id: 'att-' + Date.now(),
        workerName: 'Amit Patil',
        trade: 'Master Mason',
        siteName: siteName || 'Sunrise Residency',
        time: timeStr,
        date: 'Today',
        status: 'Present',
        method: 'QR Code Scan'
      },
      ...prev
    ]);

    logActivity(`Amit Patil verified QR code at ${siteName || 'Sunrise Residency'}`, 'attendance', 'success');
    triggerConfetti();
    addToast(`✓ QR Attendance verified at ${siteName || 'Sunrise Residency'} (${timeStr})`, 'success');
  };

  const addSite = (siteData) => {
    const newSite = {
      ...siteData,
      id: 'site-' + Date.now(),
      progress: 0,
      spent: '₹0.00 Cr',
      workerCount: 0,
      health: 'Good',
      alertCount: 0,
      image: siteData.image || 'https://images.unsplash.com/photo-1541888946425-d0fbb180c5f5?w=600&auto=format&fit=crop&q=80'
    };
    setSites(prev => [newSite, ...prev]);
    logActivity(`Created new site project: ${newSite.name}`, 'site', 'success');
    addToast(`✓ Site "${newSite.name}" added successfully`, 'success');
  };

  // User Profile based on role
  const currentUser = {
    builder: {
      name: 'Rajesh Sharma',
      role: 'Builder / Director',
      company: 'Buildwise Infra Ltd.',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80'
    },
    engineer: {
      name: 'Suresh Deshmukh',
      role: 'Lead Site Engineer',
      company: 'Sunrise Residency Site',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80'
    },
    worker: {
      name: 'Amit Patil',
      role: 'Master Mason',
      company: 'Sunrise Residency Crew',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'
    }
  }[userRole];

  return (
    <AppContext.Provider
      value={{
        sites,
        materials,
        leftovers,
        marketplace,
        workers,
        tasks,
        activities,
        attendanceLogs,
        userRole,
        setUserRole,
        currentUser,
        activeView,
        setActiveView,
        isLandingPage,
        setIsLandingPage,
        searchQuery,
        setSearchQuery,
        toasts,
        addToast,
        removeToast,
        isMobileMenuOpen,
        setIsMobileMenuOpen,
        undoStack,
        undoLastAction,
        addMaterial,
        recordUsage,
        listLeftoverOnMarketplace,
        addMarketplaceListing,
        requestMarketplaceItem,
        addWorker,
        createTask,
        updateTaskStatus,
        toggleWorkerAttendance,
        scanQRAttendance,
        addSite
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => useContext(AppContext);

import { CgProfile, CgShoppingCart } from 'react-icons/cg'
import {
  AiOutlinePlus,
  AiOutlineCompass,
  AiOutlineProject,
} from 'react-icons/ai'
import {
  MdRateReview,
  MdOutlineFeedback,
  MdOutlineLeaderboard,
  MdOutlineStorefront,
} from 'react-icons/md'
import { IconType } from 'react-icons/lib'
import { GiTeacher } from 'react-icons/gi'
import { GrInfo } from 'react-icons/gr'
import { BiTask } from 'react-icons/bi'
import { HiOutlineUsers } from 'react-icons/hi'

export interface Menu {
  name: string
  path: string
  icon: IconType
}

export const AdminMenus: Menu[] = [
  {
    name: 'Dashboard',
    icon: CgProfile,
    path: '/admin/dashboard',
  },
  {
    name: 'My Profile',
    icon: CgProfile,
    path: '/admin/profile',
  },
  {
    name: 'Create New Community',
    icon: HiOutlineUsers,
    path: '/admin/community/new',
  },
]

export const CommunityMenus: Menu[] = [
  {
    name: 'My Profile',
    icon: CgProfile,
    path: '/profile',
  },
  {
    name: 'Explore',
    icon: AiOutlineCompass,
    path: '/explore',
  },
  {
    name: 'Leaderboard',
    icon: MdOutlineLeaderboard,
    path: '/leaderboard',
  },
  {
    name: 'Marketplace',
    icon: MdOutlineStorefront,
    path: '/community/project',
  },
  {
    name: 'Create New Task',
    icon: AiOutlinePlus,
    path: '/community/task/new',
  },
  {
    name: 'Create New Project',
    icon: AiOutlineProject,
    path: '/community/project/new',
  },
  {
    name: 'My Tasks',
    icon: BiTask,
    path: '/community/dashboard',
  },
  {
    name: 'Review Submissions',
    icon: MdRateReview,
    path: '/community/evidence/summary',
  },
  {
    name: 'Tutorials',
    icon: GiTeacher,
    path: '/community/tutorials',
  },
  {
    name: 'About Us',
    icon: GrInfo,
    path: '/about',
  },
  {
    name: 'Report Bug',
    icon: MdOutlineFeedback,
    path: '/report-bug',
  },
]

export const VolunteerMenus: Menu[] = [
  {
    name: 'My Profile',
    icon: CgProfile,
    path: '/profile',
  },
  {
    name: 'My Cart',
    icon: CgShoppingCart,
    path: '/cart',
  },
  {
    name: 'Explore',
    icon: AiOutlineCompass,
    path: '/explore',
  },
  {
    name: 'Leaderboard',
    icon: MdOutlineLeaderboard,
    path: '/leaderboard',
  },
  {
    name: 'Marketplace',
    icon: MdOutlineStorefront,
    path: '/community/project',
  },
  {
    name: 'Available Tasks',
    icon: BiTask,
    path: '/',
  },
  {
    name: 'My Submissions',
    icon: MdRateReview,
    path: '/volunteer/evidence/summary',
  },
  {
    name: 'Tutorials',
    icon: GiTeacher,
    path: '/volunteer/tutorials',
  },
  {
    name: 'About Us',
    icon: GrInfo,
    path: '/about',
  },
  {
    name: 'Report Bug',
    icon: MdOutlineFeedback,
    path: '/report-bug',
  },
]

export const GuestMenus: Menu[] = [
  {
    name: 'Explore',
    icon: AiOutlineCompass,
    path: '/explore',
  },
  {
    name: 'Leaderboard',
    icon: MdOutlineLeaderboard,
    path: '/leaderboard',
  },
  {
    name: 'Marketplace',
    icon: MdOutlineStorefront,
    path: '/community/project',
  },
  {
    name: 'Available Tasks',
    icon: BiTask,
    path: '/',
  },
  {
    name: 'About Us',
    icon: GrInfo,
    path: '/about',
  },
  {
    name: 'Report Bug',
    icon: MdOutlineFeedback,
    path: '/report-bug',
  },
]

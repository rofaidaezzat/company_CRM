import React, { useState } from 'react';

import whatsappIcon from '../assets/ic_baseline-whatsapp.svg';
import egyptMap from '../assets/e05b9827c703ebae7eecb4a5cb3d31a12982d2db.png';
import { ResponsiveContainer, PieChart, Pie, LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, Cell, Area, AreaChart } from 'recharts';
import Veiw_More_Task from '../components/Sales/Veiw_More_Task';
import View_More_Sales_Report from '../components/Sales/View_More_Sales_Report';
import Month_filter from '../components/Filteration_Manager/Month_filter';
import Members_filter from '../components/Filteration_Manager/Members_filter';

const Overview: React.FC = () => {
  const [isTaskDrawerOpen, setIsTaskDrawerOpen] = useState(false);
  const [isSalesReportOpen, setIsSalesReportOpen] = useState(false);
  const [openMonthFilter, setOpenMonthFilter] = useState<string | null>(null);
  const [openMembersFilter, setOpenMembersFilter] = useState<string | null>(null);
  const [selectedMember, setSelectedMember] = useState("All members");
  const cards = [
    {
      title: "Total Deals",
      count: "10",
      subtitle: "this month",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 40 40" fill="none">
  <g clip-path="url(#clip0_2423_9936)">
    <path d="M21.25 11.25H20C19.6685 11.25 19.3505 11.1183 19.1161 10.8839C18.8817 10.6495 18.75 10.3315 18.75 10C18.75 9.83424 18.6842 9.67527 18.5669 9.55806C18.4497 9.44085 18.2908 9.375 18.125 9.375C17.9592 9.375 17.8003 9.44085 17.6831 9.55806C17.5658 9.67527 17.5 9.83424 17.5 10C17.5 10.663 17.7634 11.2989 18.2322 11.7678C18.7011 12.2366 19.337 12.5 20 12.5V13.125C20 13.2908 20.0658 13.4497 20.1831 13.5669C20.3003 13.6842 20.4592 13.75 20.625 13.75C20.7908 13.75 20.9497 13.6842 21.0669 13.5669C21.1842 13.4497 21.25 13.2908 21.25 13.125V12.5C21.913 12.5 22.5489 12.2366 23.0178 11.7678C23.4866 11.2989 23.75 10.663 23.75 10C23.75 9.33696 23.4866 8.70108 23.0178 8.23224C22.5489 7.7634 21.913 7.5 21.25 7.5H20C19.6685 7.5 19.3505 7.36831 19.1161 7.13389C18.8817 6.89947 18.75 6.58152 18.75 6.25C18.75 5.91848 18.8817 5.60054 19.1161 5.36612C19.3505 5.1317 19.6685 5 20 5H21.25C21.5815 5 21.8995 5.1317 22.1339 5.36612C22.3683 5.60054 22.5 5.91848 22.5 6.25C22.5 6.41576 22.5658 6.57474 22.6831 6.69195C22.8003 6.80916 22.9592 6.875 23.125 6.875C23.2908 6.875 23.4497 6.80916 23.5669 6.69195C23.6842 6.57474 23.75 6.41576 23.75 6.25C23.75 5.58696 23.4866 4.95108 23.0178 4.48224C22.5489 4.0134 21.913 3.75 21.25 3.75V3.125C21.25 2.95924 21.1842 2.80027 21.0669 2.68306C20.9497 2.56585 20.7908 2.5 20.625 2.5C20.4592 2.5 20.3003 2.56585 20.1831 2.68306C20.0658 2.80027 20 2.95924 20 3.125V3.75C19.337 3.75 18.7011 4.0134 18.2322 4.48224C17.7634 4.95108 17.5 5.58696 17.5 6.25C17.5 6.91304 17.7634 7.54893 18.2322 8.01777C18.7011 8.48661 19.337 8.75 20 8.75H21.25C21.5815 8.75 21.8995 8.8817 22.1339 9.11612C22.3683 9.35054 22.5 9.66848 22.5 10C22.5 10.3315 22.3683 10.6495 22.1339 10.8839C21.8995 11.1183 21.5815 11.25 21.25 11.25ZM20.625 16.25C22.232 16.25 23.8029 15.7735 25.139 14.8807C26.4752 13.9879 27.5166 12.719 28.1315 11.2343C28.7465 9.74966 28.9074 8.11599 28.5939 6.5399C28.2804 4.9638 27.5065 3.51606 26.3702 2.37976C25.2339 1.24346 23.7862 0.469628 22.2101 0.156123C20.634 -0.157382 19.0003 0.00352044 17.5157 0.618482C16.031 1.23344 14.7621 2.27485 13.8693 3.611C12.9765 4.94714 12.5 6.51803 12.5 8.125C12.5026 10.2791 13.3595 12.3442 14.8827 13.8673C16.4058 15.3905 18.4709 16.2474 20.625 16.25ZM20.625 1.25C21.9847 1.25 23.314 1.65322 24.4445 2.40865C25.5751 3.16408 26.4563 4.23781 26.9767 5.49406C27.497 6.7503 27.6332 8.13263 27.3679 9.46625C27.1026 10.7999 26.4478 12.0249 25.4864 12.9864C24.5249 13.9478 23.2999 14.6026 21.9662 14.8679C20.6326 15.1332 19.2503 14.997 17.9941 14.4767C16.7378 13.9563 15.6641 13.0751 14.9086 11.9445C14.1532 10.814 13.75 9.48475 13.75 8.125C13.752 6.30225 14.477 4.55472 15.7658 3.26584C17.0547 1.97695 18.8022 1.25199 20.625 1.25ZM39.375 18.5H34.375C33.9521 18.5009 33.5419 18.6448 33.211 18.9082C32.8801 19.1717 32.6481 19.5393 32.5525 19.9513L25.5238 17.7938C24.6177 17.5175 23.6466 17.5411 22.755 17.8613L21.7088 18.2363L16.805 17.16C15.7692 16.9322 14.6901 17.0024 13.6925 17.3625L7.35375 19.6475C7.21054 19.3073 6.9701 19.017 6.66257 18.8128C6.35504 18.6087 5.99411 18.4999 5.625 18.5H0.625C0.45924 18.5 0.300269 18.5659 0.183058 18.6831C0.065848 18.8003 0 18.9592 0 19.125L0 31.625C0 31.7908 0.065848 31.9497 0.183058 32.0669C0.300269 32.1842 0.45924 32.25 0.625 32.25H5.625C5.93357 32.2496 6.23728 32.1731 6.50919 32.0272C6.7811 31.8814 7.0128 31.6706 7.18375 31.4138C9.49573 34.3452 12.433 36.7234 15.7812 38.375L18.4788 39.7025C18.8886 39.9061 19.3449 39.9982 19.8016 39.9694C20.2584 39.9407 20.6995 39.7921 21.0805 39.5386C21.4616 39.2852 21.7692 38.9358 21.9723 38.5257C22.1754 38.1156 22.2669 37.6592 22.2375 37.2025C22.4068 37.2462 22.5803 37.2718 22.755 37.2788C22.9263 37.2785 23.0972 37.2609 23.265 37.2263C23.8123 37.1151 24.306 36.8224 24.6663 36.3957C25.0265 35.969 25.2322 35.4332 25.25 34.875C25.6054 35.0749 26.0048 35.1836 26.4125 35.1913C26.5834 35.191 26.7539 35.1734 26.9213 35.1388C27.5039 35.0204 28.0248 34.697 28.3893 34.2272C28.7538 33.7575 28.9376 33.1726 28.9075 32.5788C29.3914 32.6992 29.9011 32.6616 30.3621 32.4713C30.823 32.281 31.2108 31.948 31.4688 31.5213C31.6565 31.2377 31.7842 30.9186 31.8438 30.5838H32.5213C32.5724 31.0404 32.7894 31.4623 33.1312 31.7695C33.4729 32.0767 33.9155 32.2477 34.375 32.25H39.375C39.5408 32.25 39.6997 32.1842 39.8169 32.0669C39.9342 31.9497 40 31.7908 40 31.625V19.125C40 18.9592 39.9342 18.8003 39.8169 18.6831C39.6997 18.5659 39.5408 18.5 39.375 18.5ZM6.25 30.375C6.25 30.5408 6.18415 30.6997 6.06694 30.8169C5.94973 30.9342 5.79076 31 5.625 31H1.25V19.75H5.625C5.79076 19.75 5.94973 19.8159 6.06694 19.9331C6.18415 20.0503 6.25 20.2092 6.25 20.375V30.375ZM30.4263 30.8388C30.336 30.9759 30.2197 31.0939 30.0839 31.1861C29.9481 31.2783 29.7954 31.3429 29.6347 31.3761C29.4739 31.4093 29.3082 31.4105 29.1469 31.3796C28.9857 31.3488 28.8321 31.2865 28.695 31.1963L22.8913 27.375L22.6238 27.7813C22.5828 27.8088 22.5477 27.8442 22.5204 27.8854C22.4932 27.9266 22.4744 27.9728 22.465 28.0213L22.2038 28.4188L22.6825 28.7338C22.6887 28.7338 22.6925 28.745 22.6987 28.75L27.105 31.6525C27.3758 31.8374 27.5632 32.1213 27.6266 32.4431C27.69 32.7648 27.6245 33.0986 27.4441 33.3724C27.2637 33.6463 26.9829 33.8383 26.6623 33.9071C26.3416 33.9758 26.0068 33.9158 25.73 33.74L24.1525 32.7013L24.135 32.6875L20.3 30.1625H20.29L19.9263 29.9225C19.7878 29.8346 19.6204 29.8046 19.4601 29.839C19.2998 29.8734 19.1594 29.9694 19.0692 30.1063C18.979 30.2432 18.9462 30.4101 18.978 30.571C19.0097 30.7318 19.1033 30.8738 19.2388 30.9663L23.455 33.7425C23.6579 33.8801 23.8159 34.0743 23.9093 34.3011C24.0027 34.5278 24.0273 34.777 23.9802 35.0176C23.933 35.2582 23.8161 35.4796 23.6441 35.6543C23.472 35.829 23.2524 35.9492 23.0125 36C22.6879 36.0664 22.3503 36.0012 22.0737 35.8188L17.8412 33.0313C17.7727 32.9845 17.6956 32.9518 17.6144 32.9352C17.5331 32.9185 17.4493 32.9182 17.368 32.9342C17.2866 32.9503 17.2092 32.9824 17.1403 33.0286C17.0715 33.0749 17.0125 33.1344 16.9669 33.2036C16.9213 33.2729 16.8899 33.3506 16.8746 33.4321C16.8593 33.5136 16.8603 33.5974 16.8777 33.6785C16.8951 33.7596 16.9285 33.8364 16.9759 33.9045C17.0233 33.9726 17.0837 34.0305 17.1537 34.075L17.3738 34.22C17.38 34.22 17.3838 34.2325 17.3913 34.2375L20.3913 36.2113C20.6978 36.3952 20.9202 36.6918 21.0107 37.0377C21.1012 37.3835 21.0527 37.7511 20.8756 38.0616C20.6984 38.3721 20.4067 38.6009 20.0629 38.699C19.7191 38.7971 19.3506 38.7566 19.0363 38.5863L16.3325 37.25C12.8161 35.5149 9.78219 32.9387 7.5 29.75V20.9225L14.115 18.54C14.8912 18.2608 15.7304 18.2062 16.5363 18.3825L19.5025 19.0338L17.3575 19.8075C16.6986 20.0331 16.1563 20.5112 15.8499 21.1366C15.5435 21.7621 15.4982 22.4836 15.7238 23.1425C15.9494 23.8014 16.4275 24.3437 17.0529 24.6501C17.6783 24.9565 18.3999 25.0019 19.0588 24.7763L22.03 23.8125L30.07 29.1063C30.2188 29.2045 30.3448 29.3333 30.4397 29.4843C30.5345 29.6352 30.596 29.8046 30.62 29.9813C30.6211 30.0118 30.624 30.0423 30.6287 30.0725C30.6464 30.3428 30.5753 30.6126 30.4263 30.8388ZM32.5 29.3375H31.75C31.5716 28.8139 31.2231 28.3651 30.76 28.0625L22.47 22.6025C22.3918 22.551 22.3029 22.5178 22.2101 22.5052C22.1173 22.4927 22.0229 22.5011 21.9338 22.53L18.6763 23.5875C18.4233 23.6698 18.152 23.677 17.8951 23.6083C17.6382 23.5395 17.4067 23.3977 17.2288 23.2C17.0773 23.0325 16.9694 22.8303 16.9146 22.6112C16.8599 22.3921 16.8599 22.1628 16.9148 21.9438C16.9697 21.7247 17.0776 21.5225 17.2292 21.3551C17.3808 21.1876 17.5712 21.0601 17.7838 20.9838L23.1825 19.0363C23.8193 18.8074 24.513 18.7908 25.16 18.9888L32.5 21.2438V29.3375ZM38.75 31H34.375C34.2092 31 34.0503 30.9342 33.9331 30.8169C33.8158 30.6997 33.75 30.5408 33.75 30.375V20.375C33.75 20.2092 33.8158 20.0503 33.9331 19.9331C34.0503 19.8159 34.2092 19.75 34.375 19.75H38.75V31Z" fill="#00236F"/>
  </g>
  <defs>
    <clipPath id="clip0_2423_9936">
      <rect width="40" height="40" fill="white"/>
    </clipPath>
  </defs>
</svg>
      )
    },
    {
      title: "Total Deals Value",
      count: "50,000 EGP",
      subtitle: "",
      icon: (
       <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 40 40" fill="none">
  <g clip-path="url(#clip0_2423_9927)">
    <path d="M8.42063 34.7366C8.42063 32.9926 7.00679 31.5787 5.26271 31.5787C3.51864 31.5787 2.10479 32.9926 2.10479 34.7366C2.10479 36.4807 3.51864 37.8946 5.26271 37.8946C7.00679 37.8946 8.42063 36.4807 8.42063 34.7366ZM10.5259 34.7366C10.5259 37.6434 8.16949 39.9998 5.26271 39.9998C2.35593 39.9998 -0.000488281 37.6434 -0.000488281 34.7366C-0.000488281 31.8299 2.35593 29.4734 5.26271 29.4734C8.16949 29.4734 10.5259 31.8299 10.5259 34.7366ZM33.684 13.6838V12.6312H32.6314C32.0501 12.6312 31.5787 12.1599 31.5787 11.5786C31.5787 10.9972 32.0501 10.5259 32.6314 10.5259H34.7366C35.3179 10.5259 35.7893 10.0546 35.7893 9.47327V8.42063H32.6314C32.0501 8.42063 31.5787 7.94935 31.5787 7.36799V5.26271C31.5787 3.88811 32.4581 2.72158 33.684 2.28776V1.05215C33.684 0.4708 34.1554 -0.000488281 34.7366 -0.000488281C35.3179 -0.000488281 35.7893 0.4708 35.7893 1.05215V2.10479H36.8419C37.4232 2.10479 37.8946 2.57608 37.8946 3.15743C37.8946 3.73878 37.4232 4.21007 36.8419 4.21007H34.7366C34.1554 4.21007 33.684 4.68136 33.684 5.26271V6.31535H36.8419C37.4232 6.31535 37.8946 6.78664 37.8946 7.36799V9.47327C37.8946 10.8476 37.015 12.0122 35.7893 12.4462V13.6838C35.7893 14.2652 35.3179 14.7365 34.7366 14.7365C34.1554 14.7365 33.684 14.2652 33.684 13.6838ZM23.1576 28.4208C23.1576 26.6768 21.7437 25.2629 19.9997 25.2629C18.2557 25.2629 16.8418 26.6768 16.8418 28.4208V34.7366L16.8582 35.0594C17.0199 36.6518 18.3645 37.8946 19.9997 37.8946C21.7437 37.8946 23.1576 36.4807 23.1576 34.7366V28.4208ZM25.2629 34.7366C25.2629 37.6434 22.9064 39.9998 19.9997 39.9998C17.2748 39.9998 15.0329 37.9291 14.7632 35.2754L14.7365 34.7366V28.4208C14.7365 25.514 17.0929 23.1576 19.9997 23.1576C22.9064 23.1576 25.2629 25.514 25.2629 28.4208V34.7366ZM37.8946 24.2102C37.8946 22.4662 36.4807 21.0523 34.7366 21.0523C32.9926 21.0523 31.5787 22.4662 31.5787 24.2102V34.7366C31.5787 36.4807 32.9926 37.8946 34.7366 37.8946C36.4807 37.8946 37.8946 36.4807 37.8946 34.7366V24.2102ZM39.9998 34.7366C39.9998 37.6434 37.6434 39.9998 34.7366 39.9998C31.8299 39.9998 29.4734 37.6434 29.4734 34.7366V24.2102C29.4734 21.3035 31.8299 18.947 34.7366 18.947C37.6434 18.947 39.9998 21.3035 39.9998 24.2102V34.7366Z" fill="#00236F"/>
  </g>
  <defs>
    <clipPath id="clip0_2423_9927">
      <rect width="40" height="40" fill="white"/>
    </clipPath>
  </defs>
</svg>
      )
    },
    {
      title: "Conversion Rate",
      count: "15%",
      subtitle: "this month",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 40 40" fill="none">
  <path d="M22.5 21.875H17.5C17.1548 21.875 16.875 22.1548 16.875 22.5V35C16.875 35.3452 17.1548 35.625 17.5 35.625H22.5C22.8452 35.625 23.125 35.3452 23.125 35V22.5C23.125 22.1548 22.8452 21.875 22.5 21.875Z" fill="#D4D5D8"/>
  <path d="M30 18.125H25C24.6548 18.125 24.375 18.4048 24.375 18.75V35C24.375 35.3452 24.6548 35.625 25 35.625H30C30.3452 35.625 30.625 35.3452 30.625 35V18.75C30.625 18.4048 30.3452 18.125 30 18.125Z" fill="#D4D5D8"/>
  <path d="M37.5 11.25H32.5C32.1548 11.25 31.875 11.5298 31.875 11.875V35C31.875 35.3452 32.1548 35.625 32.5 35.625H37.5C37.8452 35.625 38.125 35.3452 38.125 35V11.875C38.125 11.5298 37.8452 11.25 37.5 11.25Z" fill="#D4D5D8"/>
  <path d="M15 18.75H10C9.65482 18.75 9.375 19.0298 9.375 19.375V35C9.375 35.3452 9.65482 35.625 10 35.625H15C15.3452 35.625 15.625 35.3452 15.625 35V19.375C15.625 19.0298 15.3452 18.75 15 18.75Z" fill="#D4D5D8"/>
  <path d="M7.5 24.375H2.5C2.15482 24.375 1.875 24.6548 1.875 25V35C1.875 35.3452 2.15482 35.625 2.5 35.625H7.5C7.84518 35.625 8.125 35.3452 8.125 35V25C8.125 24.6548 7.84518 24.375 7.5 24.375Z" fill="#D4D5D8"/>
  <path d="M19.9999 20.6252C19.8562 20.6252 19.7187 20.5752 19.5999 20.4814L12.4562 14.5314L6.38744 18.5814C6.09994 18.7752 5.71244 18.6939 5.51869 18.4064C5.32494 18.1189 5.40619 17.7314 5.69369 17.5377L12.1499 13.2314C12.3812 13.0752 12.6812 13.0939 12.8937 13.2689L19.9562 19.1564L33.9249 5.1877C34.1687 4.94395 34.5624 4.94395 34.8062 5.1877C35.0499 5.43145 35.0499 5.8252 34.8062 6.06895L20.4312 20.4439C20.3124 20.5627 20.1499 20.6252 19.9874 20.6252H19.9999Z" fill="#00236F"/>
  <path d="M5 20.625C6.03553 20.625 6.875 19.7855 6.875 18.75C6.875 17.7145 6.03553 16.875 5 16.875C3.96447 16.875 3.125 17.7145 3.125 18.75C3.125 19.7855 3.96447 20.625 5 20.625Z" fill="#00236F"/>
  <path d="M35 4.375H31.875C31.5312 4.375 31.25 4.65625 31.25 5C31.25 5.34375 31.5312 5.625 31.875 5.625H34.375V8.125C34.375 8.46875 34.6562 8.75 35 8.75C35.3438 8.75 35.625 8.46875 35.625 8.125V5C35.625 4.65625 35.3438 4.375 35 4.375Z" fill="#00236F"/>
  <path d="M38.125 35.625H1.875C1.53125 35.625 1.25 35.3438 1.25 35C1.25 34.6562 1.53125 34.375 1.875 34.375H38.125C38.4688 34.375 38.75 34.6562 38.75 35C38.75 35.3438 38.4688 35.625 38.125 35.625Z" fill="#3763C4"/>
</svg>
      )
    },
    {
      title: "Total Commission",
      count: "10,000 EGP",
      subtitle: "",
      icon: (
       <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 40 40" fill="none">
  <g clip-path="url(#clip0_2423_11472)">
    <path d="M38.125 4.375H1.875C1.37772 4.375 0.900805 4.57254 0.549175 4.92417C0.197544 5.27581 0 5.75272 0 6.25L0 27.5C0 27.9973 0.197544 28.4742 0.549175 28.8258C0.900805 29.1775 1.37772 29.375 1.875 29.375H2.1875V30.625C2.1875 31.1223 2.38504 31.5992 2.73667 31.9508C3.08831 32.3025 3.56522 32.5 4.0625 32.5H4.375V33.75C4.375 34.2473 4.57254 34.7242 4.92417 35.0758C5.27581 35.4275 5.75272 35.625 6.25 35.625H33.75C34.2473 35.625 34.7242 35.4275 35.0758 35.0758C35.4275 34.7242 35.625 34.2473 35.625 33.75V32.5H35.9375C36.4348 32.5 36.9117 32.3025 37.2633 31.9508C37.615 31.5992 37.8125 31.1223 37.8125 30.625V29.375H38.125C38.6223 29.375 39.0992 29.1775 39.4508 28.8258C39.8025 28.4742 40 27.9973 40 27.5V6.25C40 5.75272 39.8025 5.27581 39.4508 4.92417C39.0992 4.57254 38.6223 4.375 38.125 4.375ZM34.375 33.75C34.375 33.9158 34.3092 34.0747 34.1919 34.1919C34.0747 34.3092 33.9158 34.375 33.75 34.375H6.25C6.08424 34.375 5.92527 34.3092 5.80806 34.1919C5.69085 34.0747 5.625 33.9158 5.625 33.75V32.5H34.375V33.75ZM36.5625 30.625C36.5625 30.7908 36.4967 30.9497 36.3794 31.0669C36.2622 31.1842 36.1033 31.25 35.9375 31.25H4.0625C3.89674 31.25 3.73777 31.1842 3.62056 31.0669C3.50335 30.9497 3.4375 30.7908 3.4375 30.625V29.375H36.5625V30.625ZM38.75 27.5C38.75 27.6658 38.6842 27.8247 38.5669 27.9419C38.4497 28.0592 38.2908 28.125 38.125 28.125H1.875C1.70924 28.125 1.55027 28.0592 1.43306 27.9419C1.31585 27.8247 1.25 27.6658 1.25 27.5V6.25C1.25 6.08424 1.31585 5.92527 1.43306 5.80806C1.55027 5.69085 1.70924 5.625 1.875 5.625H38.125C38.2908 5.625 38.4497 5.69085 38.5669 5.80806C38.6842 5.92527 38.75 6.08424 38.75 6.25V27.5Z" fill="#00236F"/>
    <path d="M35 13.125C34.0054 13.125 33.0516 12.7299 32.3483 12.0267C31.6451 11.3234 31.25 10.3696 31.25 9.375C31.25 9.20924 31.1842 9.05027 31.0669 8.93306C30.9497 8.81585 30.7908 8.75 30.625 8.75H9.375C9.20924 8.75 9.05027 8.81585 8.93306 8.93306C8.81585 9.05027 8.75 9.20924 8.75 9.375C8.75 10.3696 8.35491 11.3234 7.65165 12.0267C6.94839 12.7299 5.99456 13.125 5 13.125C4.83424 13.125 4.67527 13.1908 4.55806 13.3081C4.44085 13.4253 4.375 13.5842 4.375 13.75V20C4.375 20.1658 4.44085 20.3247 4.55806 20.4419C4.67527 20.5592 4.83424 20.625 5 20.625C5.99456 20.625 6.94839 21.0201 7.65165 21.7233C8.35491 22.4266 8.75 23.3804 8.75 24.375C8.75 24.5408 8.81585 24.6997 8.93306 24.8169C9.05027 24.9342 9.20924 25 9.375 25H30.625C30.7908 25 30.9497 24.9342 31.0669 24.8169C31.1842 24.6997 31.25 24.5408 31.25 24.375C31.25 23.3804 31.6451 22.4266 32.3483 21.7233C33.0516 21.0201 34.0054 20.625 35 20.625C35.1658 20.625 35.3247 20.5592 35.4419 20.4419C35.5592 20.3247 35.625 20.1658 35.625 20V13.75C35.625 13.5842 35.5592 13.4253 35.4419 13.3081C35.3247 13.1908 35.1658 13.125 35 13.125ZM34.375 19.4125C33.2729 19.551 32.2484 20.0525 31.4629 20.8379C30.6775 21.6234 30.176 22.6479 30.0375 23.75H9.9625C9.824 22.6479 9.32247 21.6234 8.53706 20.8379C7.75165 20.0525 6.72707 19.551 5.625 19.4125V14.3375C6.72707 14.199 7.75165 13.6975 8.53706 12.9121C9.32247 12.1266 9.824 11.1021 9.9625 10H30.0375C30.176 11.1021 30.6775 12.1266 31.4629 12.9121C32.2484 13.6975 33.2729 14.199 34.375 14.3375V19.4125Z" fill="#00236F"/>
    <path d="M20 11.25C18.8875 11.25 17.7999 11.5799 16.8749 12.198C15.9499 12.8161 15.2289 13.6946 14.8032 14.7224C14.3774 15.7502 14.266 16.8812 14.4831 17.9724C14.7001 19.0635 15.2359 20.0658 16.0225 20.8525C16.8092 21.6391 17.8115 22.1749 18.9026 22.3919C19.9938 22.609 21.1248 22.4976 22.1526 22.0718C23.1804 21.6461 24.0589 20.9251 24.677 20.0001C25.2951 19.0751 25.625 17.9875 25.625 16.875C25.625 15.3832 25.0324 13.9524 23.9775 12.8975C22.9226 11.8426 21.4918 11.25 20 11.25ZM20 21.25C19.1347 21.25 18.2888 20.9934 17.5694 20.5127C16.8499 20.0319 16.2892 19.3487 15.958 18.5492C15.6269 17.7498 15.5403 16.8701 15.7091 16.0215C15.8779 15.1728 16.2946 14.3933 16.9064 13.7814C17.5183 13.1696 18.2978 12.7529 19.1465 12.5841C19.9951 12.4153 20.8748 12.5019 21.6742 12.833C22.4737 13.1642 23.1569 13.7249 23.6377 14.4444C24.1184 15.1638 24.375 16.0097 24.375 16.875C24.375 18.0353 23.9141 19.1481 23.0936 19.9686C22.2731 20.7891 21.1603 21.25 20 21.25Z" fill="#00236F"/>
  </g>
  <defs>
    <clipPath id="clip0_2423_11472">
      <rect width="40" height="40" fill="white"/>
    </clipPath>
  </defs>
</svg>
      )
    }
  ];

  const getLeadsData = () => {
    const baseData = [
      { status: "Fresh",          value: 95 },
      { status: "Followup",       value: 88 },
      { status: "Interested",     value: 82 },
      { status: "Not interested", value: 55 },
      { status: "Meeting",        value: 45 },
      { status: "Wrong number",   value: 38 },
      { status: "No answer",      value: 30 },
      { status: "Deal",           value: 15 },
    ];
    if (selectedMember === "All members") {
      return baseData;
    }
    const hash = selectedMember.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return baseData.map(item => ({
      ...item,
      value: Math.max(5, Math.min(100, Math.round(item.value * (0.4 + (hash % 7) * 0.1))))
    }));
  };

  return (
    <div style={{ background: "#F5F6FA", width: "100%", boxSizing: "border-box", paddingBottom: 32 }}>
      {/* Header */}
      <div className="overview-header" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 32 }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
          <h1 style={{ margin: 0, color: "#141414", fontFamily: "Inter, sans-serif", fontSize: 19, fontWeight: 400 }}>
            Good Morning, Mohammed
          </h1>
          <span style={{ color: "#747474", fontFamily: "Inter, sans-serif", fontSize: 16, fontWeight: 400 }}>
            26 Apr 2026 - View your latest updates...
          </span>
        </div>
        
        
      </div>
      <div className="overview-main" style={{ display: "flex", flexDirection: "column", gap: 24, width: "100%" }}>
                
                {/* Row 1 & 2: Summary Cards (6 items) */}
                <div className="overview-cards-grid" style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
                  width: "100%",
                  gap: 24
                }}>
                  {cards.map((card, index) => (
                    <div key={index} style={{
                      background: "rgba(255, 255, 255, 1)",
                      boxShadow: "0px 1px 3px 0px rgba(0, 0, 0, 0.11)",
                      width: "100%",
                      height: 127,
                      borderRadius: 12,
                      padding: "32px 24px",
                      display: "flex",
                      alignItems: "center",
                      gap: 16,
                      boxSizing: "border-box"
                    }}>
                      {/* Icon circle */}
                      <div style={{
                        width: 64,
                        height: 64,
                        borderRadius: "50%",
                        backgroundColor: "#F4F5F7",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexShrink: 0
                      }}>
                        {card.icon}
                      </div>
                      
                      {/* Text content */}
                      <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                        <span style={{ 
                          fontFamily: "Inter, sans-serif", 
                          fontSize: 16, 
                          fontWeight: 400, 
                          color: "#111827" 
                        }}>
                          {card.title}
                        </span>
                        <div style={{ display: "flex", alignItems: "baseline", gap: 6 }}>
                          <div style={{ display: "flex", alignItems: "baseline", gap: 4 }}>
                            {(() => {
                              const parts = card.count.split(" ");
                              if (parts.length > 1) {
                                const [val, unit] = parts;
                                return (
                                  <>
                                    <span style={{
                                      fontFamily: "Inter, sans-serif",
                                      fontSize: 23,
                                      fontWeight: 700,
                                      color: "var(--Foundation-neutral-neutral-950, #141414)",
                                      lineHeight: "normal"
                                    }}>
                                      {val}
                                    </span>
                                    <span style={{
                                      fontFamily: "Inter, sans-serif",
                                      fontSize: 16,
                                      fontWeight: 400,
                                      color: "var(--Foundation-neutral-neutral-950, #141414)",
                                      lineHeight: "normal"
                                    }}>
                                      {unit}
                                    </span>
                                  </>
                                );
                              } else {
                                return (
                                  <span style={{
                                    fontFamily: "Inter, sans-serif",
                                    fontSize: 23,
                                    fontWeight: 700,
                                    color: "var(--Foundation-neutral-neutral-950, #141414)",
                                    lineHeight: "normal"
                                  }}>
                                    {card.count}
                                  </span>
                                );
                              }
                            })()}
                          </div>
                          <span style={{ 
                            fontFamily: "Inter, sans-serif", 
                            fontSize: 14, 
                            fontWeight: 400, 
                            color: "#6B7280" 
                          }}>
                            {card.subtitle}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

              {/* Row 2: Table & Location side-by-side */}
              <div style={{ display: "flex", gap: 24, flexWrap: "wrap", alignItems: "flex-start", width: "100%" }}>
                {/* Top Performers Table */}
                 <div className="overview-top-performers" style={{
                   borderRadius: 12,
                   background: "var(--Foundation-neutral-white, #FFF)",
                   boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.11)",
                   display: "flex",
                   flex: "1 1 600px",
                   minWidth: 320,
                   height: "453px",
                   padding: 16,
                   flexDirection: "column",
                   justifyContent: "flex-start",
                   alignItems: "flex-start",
                   gap: 16,
                   boxSizing: "border-box"
                 }}>
                   {/* Header with Title and Button */}
                   <div style={{
                     display: "flex",
                     justifyContent: "space-between",
                     alignItems: "center",
                     alignSelf: "stretch"
                   }}>
                     <span style={{ fontSize: 18, color: "#141414", fontFamily: "Inter, sans-serif", fontWeight: 400 }}>Top Performers Table</span>
                     <div style={{ position: "relative" }}>
                       <button onClick={() => setOpenMonthFilter(openMonthFilter === 'top-performers' ? null : 'top-performers')} style={{
                         display: "flex",
                         alignItems: "center",
                         gap: 8,
                         padding: "8px 12px",
                         borderRadius: 8,
                         border: "1px solid #D4D5D8",
                         background: "#FFF",
                         color: "#4B5563",
                         fontSize: 14,
                         fontFamily: "Inter, sans-serif",
                         cursor: "pointer"
                       }}>
                         This month
                         <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>
                       </button>
                       {openMonthFilter === 'top-performers' && (
                         <div style={{ position: "absolute", top: "100%", right: 0, zIndex: 10, marginTop: 4 }}>
                           <Month_filter onChange={() => setOpenMonthFilter(null)} onClickOutside={() => setOpenMonthFilter(null)} />
                         </div>
                       )}
                     </div>
                   </div>
                   
                   {/* The table */}
                   <div className="custom-scrollbar" style={{ width: "100%", overflowX: "auto", overflowY: "auto", flex: "1 1 0%" }}>
                     <div style={{
                       display: "flex",
                       flexDirection: "column",
                       alignItems: "flex-start",
                       gap: 16,
                       minWidth: 600
                     }}>
                       {/* Header of table */}
                       <div style={{
                         borderRadius: "12px 12px 0 0",
                         background: "var(--Foundation-neutral-neutral-100, #D4D5D8)",
                         display: "flex",
                         width: "100%",
                         height: 48,
                         padding: "0 32px 0 12px",
                         justifyContent: "space-between",
                         alignItems: "center",
                         boxSizing: "border-box"
                       }}>
                         <span style={{ width: 32, flexShrink: 0, fontSize: 12, fontWeight: 600, color: "#4B5563", fontFamily: "Inter, sans-serif" }}>Rank</span>
                         <span style={{ width: 146, flexShrink: 0, fontSize: 12, fontWeight: 600, color: "#4B5563", fontFamily: "Inter, sans-serif" }}>Sales Name</span>
                         <span style={{ width: 60, flexShrink: 0, fontSize: 12, fontWeight: 600, color: "#4B5563", fontFamily: "Inter, sans-serif", textAlign: "center" }}>Deals</span>
                         <span style={{ width: 140, flexShrink: 0, fontSize: 12, fontWeight: 600, color: "#4B5563", fontFamily: "Inter, sans-serif", textAlign: "center" }}>Target</span>
                         <span style={{ width: 98, flexShrink: 0, fontSize: 12, fontWeight: 600, color: "#4B5563", fontFamily: "Inter, sans-serif", textAlign: "right" }}>Revenue (EGP)</span>
                       </div>

                       {/* Table Rows */}
                       <div style={{ width: "100%", display: "flex", flexDirection: "column" }}>
                         {[
                           { rank: 1, name: "John Dorgham", deals: 120, target: 85, revenue: "5,400,000" },
                           { rank: 2, name: "Amr Abdelaziz", deals: 95, target: 70, revenue: "4,200,000" },
                           { rank: 3, name: "Sara Elmasry", deals: 88, target: 65, revenue: "3,950,000" },
                           { rank: 4, name: "Mustafa Mahmoud", deals: 74, target: 50, revenue: "3,100,000" },
                           { rank: 5, name: "Youssef Hassan", deals: 65, target: 45, revenue: "2,800,000" },
                           { rank: 6, name: "Nour El-Din", deals: 50, target: 35, revenue: "2,150,000" },
                         ].map((item) => (
                           <div key={item.rank} style={{
                             borderBottom: "1px solid var(--Foundation-neutral-neutral-50, #EDEFF2)",
                             display: "flex",
                             width: "100%",
                             padding: 12,
                             justifyContent: "space-between",
                             alignItems: "center",
                             boxSizing: "border-box"
                           }}>
                             {/* Rank */}
                             <div style={{
                               width: 32, flexShrink: 0, display: "flex", alignItems: "center"
                             }}>
                               <div style={{
                                 width: 24, height: 24, borderRadius: "50%", background: "#F4ECE5", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 600, color: "#4B5563", fontFamily: "Inter, sans-serif"
                               }}>
                                 {item.rank}
                               </div>
                             </div>
                             
                             {/* Sales Name */}
                             <span style={{ width: 146, flexShrink: 0, fontSize: 14, color: "#374151", fontFamily: "Inter, sans-serif" }}>{item.name}</span>
                             
                             {/* Deals */}
                             <span style={{ width: 60, flexShrink: 0, fontSize: 14, color: "#4B5563", fontFamily: "Inter, sans-serif", textAlign: "center" }}>{item.deals}</span>
                             
                             {/* Target */}
                             <div style={{ width: 140, flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
                               <div style={{ width: 64, height: 8, background: "#D4D5D8", borderRadius: 4, display: "flex", overflow: "hidden" }}>
                                 <div style={{ width: `${item.target}%`, height: "100%", background: "#00236F" }} />
                               </div>
                               <span style={{ fontSize: 12, color: "#4B5563", fontFamily: "Inter, sans-serif" }}>{item.target}%</span>
                             </div>
                             
                             {/* Revenue */}
                             <span style={{ width: 98, flexShrink: 0, fontSize: 14, color: "#4B5563", fontFamily: "Inter, sans-serif", textAlign: "right" }}>{item.revenue}</span>
                           </div>
                         ))}
                       </div>
                     </div>
                   </div>
                 </div>

              {/* Top Deals Location */}
              <div className="overview-top-deals-location" style={{
                  borderRadius: "12px",
                  background: "var(--Foundation-neutral-white, #FFF)",
                  boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.11)",
                  display: "flex",
                  width: "365px",
                  maxWidth: "100%",
                  height: "453px",
                  padding: "16px",
                  flexDirection: "column",
                  alignItems: "flex-start",
                  gap: "24px",
                  boxSizing: "border-box"
                }}>
                  <span style={{ fontSize: 16, fontWeight: 500, color: "#111827", fontFamily: "Inter, sans-serif" }}>Top Deals Location</span>
                  
                  <div style={{
                    borderRadius: "12px",
                    background: `url(${egyptMap}) lightgray 0px -2.777px / 100% 103.805% no-repeat`,
                    display: "flex",
                    height: "146px",
                    padding: "12px",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "flex-start",
                    gap: "12px",
                    flexShrink: 0,
                    alignSelf: "stretch"
                  }} />
                  
                  <div className="custom-scrollbar" style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "flex-start",
                    gap: "16px",
                    flex: "1 0 0",
                    alignSelf: "stretch",
                    overflowY: "auto",
                    paddingRight: "4px"
                  }}>
                    {[
                      { name: "Cairo", percentage: "25%" },
                      { name: "Giza", percentage: "25%" },
                      { name: "Alexandria", percentage: "25%" },
                      { name: "Mansoura", percentage: "25%" },
                      { name: "Dakahlia", percentage: "25%" },
                      { name: "Menoufia", percentage: "25%" }
                    ].map((city, idx) => (
                      <div key={idx} style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        width: "100%",
                        fontFamily: "Inter, sans-serif",
                        fontSize: "14px",
                        color: "#374151"
                      }}>
                        <span>{idx + 1}. {city.name}</span>
                        <span>{city.percentage}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
      
      </div>

      {/* Charts Row */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: 24, marginTop: 24 }}>

        {/* Sales Funnel Performance */}
        <div style={{
          borderRadius: 12,
          background: "var(--Foundation-neutral-white, #FFF)",
          boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.11)",
          display: "flex",
          flex: "1 1 600px",
          minWidth: 320,
          height: 389,
          padding: 16,
          flexDirection: "column",
          alignItems: "flex-start",
          gap: 8,
          boxSizing: "border-box"
        }}>
          {/* Header */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", width: "100%" }}>
            <span style={{ fontSize: 16, fontWeight: 500, color: "#111827", fontFamily: "Inter, sans-serif" }}>Sales Funnel Performance</span>
            <div style={{ display: "flex", gap: 8 }}>
              <button style={{ padding: "6px 12px", border: "1px solid #D4D5D8", borderRadius: 8, background: "#FFF", fontSize: 13, color: "#374151", fontFamily: "Inter, sans-serif", cursor: "pointer", display: "flex", alignItems: "center", gap: 4 }}>All Sales <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m6 9 6 6 6-6"/></svg></button>
              <div style={{ position: "relative" }}>
                <button onClick={() => setOpenMonthFilter(openMonthFilter === 'sales-funnel' ? null : 'sales-funnel')} style={{ padding: "6px 12px", border: "1px solid #D4D5D8", borderRadius: 8, background: "#FFF", fontSize: 13, color: "#374151", fontFamily: "Inter, sans-serif", cursor: "pointer", display: "flex", alignItems: "center", gap: 4 }}>This month <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m6 9 6 6 6-6"/></svg></button>
                {openMonthFilter === 'sales-funnel' && (
                  <div style={{ position: "absolute", top: "100%", right: 0, zIndex: 10, marginTop: 4 }}>
                    <Month_filter onChange={() => setOpenMonthFilter(null)} onClickOutside={() => setOpenMonthFilter(null)} />
                  </div>
                )}
              </div>
            </div>
          </div>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={[
              { month: "Jan", Leads: 480, Deals: 160 },
              { month: "Feb", Leads: 800, Deals: 320 },
              { month: "Mar", Leads: 500, Deals: 340 },
              { month: "Apr", Leads: 620, Deals: 100 },
              { month: "May", Leads: 800, Deals: 180 },
              { month: "June", Leads: 460, Deals: 320 },
              { month: "July", Leads: 620, Deals: 80 },
              { month: "Aug", Leads: 500, Deals: 160 },
              { month: "Sep", Leads: 480, Deals: 130 },
            ]} margin={{ top: 24, right: 16, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#6B7280", fontFamily: "Inter, sans-serif" }} />
              <YAxis 
                tick={{ fontSize: 11, fill: "#6B7280", fontFamily: "Inter, sans-serif" }} 
                label={{ value: 'Count', angle: -90, position: 'insideLeft', fill: '#6B7280', fontSize: 13, fontFamily: "Inter, sans-serif", offset: 10 }}
              />
              <Tooltip />
              <Legend verticalAlign="top" align="right" wrapperStyle={{ fontSize: 12, fontFamily: "Inter, sans-serif", paddingBottom: 16 }} />
              <Line type="linear" dataKey="Leads" stroke="#00236F" strokeWidth={1} dot={{ r: 3, fill: '#FFF', strokeWidth: 1 }} activeDot={{ r: 5 }} />
              <Line type="linear" dataKey="Deals" stroke="#4CAF50" strokeWidth={1} dot={{ r: 3, fill: '#FFF', strokeWidth: 1 }} activeDot={{ r: 5 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Team Revenue Target */}
        <div style={{
          borderRadius: 12,
          background: "var(--Foundation-neutral-white, #FFF)",
          boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.11)",
          display: "flex",
          flex: "1 1 500px",
          minWidth: 280,
          minHeight: 389,
          padding: 16,
          flexDirection: "column",
          justifyContent: "flex-start",
          alignItems: "flex-start",
          gap: 8,
          boxSizing: "border-box"
        }}>
          {/* Header */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", alignSelf: "stretch", width: "100%" }}>
            <span style={{ fontSize: 16, fontWeight: 500, color: "#111827", fontFamily: "Inter, sans-serif" }}>Team Revenue Target</span>
            <div style={{ position: "relative" }}>
              <button onClick={() => setOpenMonthFilter(openMonthFilter === 'team-revenue' ? null : 'team-revenue')} style={{ padding: "6px 12px", border: "1px solid #D4D5D8", borderRadius: 8, background: "#FFF", fontSize: 13, color: "#374151", fontFamily: "Inter, sans-serif", cursor: "pointer", display: "flex", alignItems: "center", gap: 4 }}>This Month <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m6 9 6 6 6-6"/></svg></button>
              {openMonthFilter === 'team-revenue' && (
                <div style={{ position: "absolute", top: "100%", right: 0, zIndex: 10, marginTop: 4 }}>
                  <Month_filter onChange={() => setOpenMonthFilter(null)} onClickOutside={() => setOpenMonthFilter(null)} />
                </div>
              )}
            </div>
          </div>

          {/* The content div style */}
          <div style={{ display: "flex", width: "100%", flexDirection: "column", alignItems: "flex-start", gap: 20, flexShrink: 0 }}>
            {/* Title text */}
            <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
              <div style={{ fontSize: 18, fontWeight: 700, color: "#111827", fontFamily: "Inter, sans-serif" }}>25,000 EGP <span style={{ fontSize: 14, fontWeight: 400, color: "#6B7280" }}>/40,000 EGP</span></div>
              <div style={{ fontSize: 13, color: "#6B7280", fontFamily: "Inter, sans-serif" }}>Only 15,000 left !</div>
            </div>

            <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: 16, width: "100%", flex: 1, alignItems: "center" }}>
              {/* Donut */}
              <div style={{ width: 190, height: 190, position: "relative", flexShrink: 0 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={[
                        { name: 'Completed', value: 60, fill: '#00236F' },
                        { name: 'Remaining', value: 40, fill: '#B0BBD2' }
                      ]}
                      innerRadius={70.167}
                      outerRadius={95}
                      startAngle={90}
                      endAngle={-270}
                      dataKey="value"
                      stroke="none"
                      cornerRadius={0}
                    />
                  </PieChart>
                </ResponsiveContainer>
                {/* Centered text */}
                <div style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", pointerEvents: "none" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                    <span style={{ fontSize: 40, fontWeight: 700, color: "#FFF", fontFamily: "'Noto Sans', sans-serif", WebkitTextStroke: "1.66px #000", lineHeight: "normal" }}>60</span>
                    <span style={{ fontSize: 26, fontWeight: 700, color: "#FFF", fontFamily: "'Noto Sans', sans-serif", WebkitTextStroke: "1.07px #000", lineHeight: "normal" }}>%</span>
                  </div>
                  <span style={{ fontSize: 14, color: "#00236F", fontFamily: "Inter, sans-serif", fontWeight: 500 }}>Completed</span>
                </div>
              </div>

              {/* Team list */}
              <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "flex-start", gap: 16, flex: "1 1 200px" }}>
                {[
                  { name: "Mohammed Gammal", value: "6000 EGP", pct: 12 },
                  { name: "Moataz Gammal", value: "6000 EGP", pct: 20 },
                  { name: "Rewan Gammal", value: "6000 EGP", pct: 18 },
                  { name: "Rewan Gammal", value: "6000 EGP", pct: 18 },
                ].map((member, i) => (
                  <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", alignSelf: "stretch", width: "100%" }}>
                    <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                      <span style={{ fontSize: 13, color: "#374151", fontFamily: "Inter, sans-serif" }}>{member.name}</span>
                      <span style={{ fontSize: 13, color: "#111827", fontFamily: "Inter, sans-serif", fontWeight: 700 }}>{member.value}</span>
                    </div>
                    
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <div style={{ borderRadius: 4, background: "var(--border-input-enabled, #D8D8D8)", display: "flex", height: 10, width: 80, alignItems: "center", overflow: "hidden" }}>
                        <div style={{ width: `${member.pct}%`, height: "100%", background: "#00236F" }} />
                      </div>
                      <span style={{ fontSize: 12, color: "#6B7280", fontFamily: "Inter, sans-serif", width: 28 }}>{member.pct}%</span>
                    </div>
                  </div>
                ))}
                <span style={{ fontSize: 12, color: "#1D4ED8", textDecoration: "underline", cursor: "pointer", fontFamily: "Inter, sans-serif" }}>View All</span>
              </div>
            </div>
          </div>
        </div>

        {/* Revenue Performance */}
        <div style={{
          borderRadius: 12,
          background: "var(--Foundation-neutral-white, #FFF)",
          boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.11)",
          display: "flex",
          flex: "1 1 600px",
          minWidth: 320,
          height: 389,
          padding: 16,
          flexDirection: "column",
          alignItems: "flex-start",
          gap: 8,
          boxSizing: "border-box"
        }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", width: "100%" }}>
            <span style={{ fontSize: 16, fontWeight: 500, color: "#111827", fontFamily: "Inter, sans-serif" }}>Revenue Performance</span>
            <button style={{ padding: "6px 12px", border: "1px solid #D4D5D8", borderRadius: 8, background: "#FFF", fontSize: 13, color: "#374151", fontFamily: "Inter, sans-serif", cursor: "pointer", display: "flex", alignItems: "center", gap: 4 }}>All Sales <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m6 9 6 6 6-6"/></svg></button>
          </div>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={[
              { month: "Jan",  Target: 40000, Achieved: 35000 },
              { month: "Feb",  Target: 90000, Achieved: 80000 },
              { month: "Mar",  Target: 40000, Achieved: 50000 },
              { month: "Apr",  Target: 55000, Achieved: 30000 },
              { month: "May",  Target: 35000, Achieved: 90000 },
              { month: "June", Target: 65000, Achieved: 45000 },
              { month: "July", Target: 50000, Achieved: 10000 },
              { month: "Aug",  Target: 65000, Achieved: 60000 },
              { month: "Sept", Target: 60000, Achieved: 60000 },
            ]} margin={{ top: 24, right: 16, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="targetGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#EC130F" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#EC130F" stopOpacity={0.05}/>
                </linearGradient>
                <linearGradient id="achievedGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#4BA832" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#4BA832" stopOpacity={0.05}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#6B7280", fontFamily: "Inter, sans-serif" }} />
              <YAxis tick={{ fontSize: 11, fill: "#6B7280", fontFamily: "Inter, sans-serif" }} tickFormatter={(v) => `${v/1000}K`} />
              <Tooltip formatter={(v: number) => `${(v/1000).toFixed(0)}K`} />
              <Legend verticalAlign="top" align="right" wrapperStyle={{ fontSize: 12, fontFamily: "Inter, sans-serif", paddingBottom: 16 }} />
              <Area 
                type="linear" 
                dataKey="Target" 
                stroke="#EC130F" 
                strokeWidth={1} 
                fill="url(#targetGrad)" 
                style={{ filter: "drop-shadow(0 3px 3px rgba(195, 27, 27, 0.40)) drop-shadow(0 6px 9px rgba(195, 27, 27, 0.40)) drop-shadow(0 9px 18px rgba(195, 27, 27, 0.40))" }}
                dot={{ r: 3, fill: "#FFF", strokeWidth: 1 }} 
                activeDot={{ r: 5 }} 
              />
              <Area 
                type="linear" 
                dataKey="Achieved" 
                stroke="#4BA832" 
                strokeWidth={1} 
                fill="url(#achievedGrad)" 
                style={{ filter: "drop-shadow(0 3px 3px rgba(81, 195, 27, 0.40)) drop-shadow(0 6px 9px rgba(81, 195, 27, 0.40)) drop-shadow(0 9px 18px rgba(81, 195, 27, 0.40))" }}
                dot={{ r: 3, fill: "#FFF", strokeWidth: 1 }} 
                activeDot={{ r: 5 }} 
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Leads Status Distribution */}
        <div style={{
          borderRadius: 12,
          background: "var(--Foundation-neutral-white, #FFF)",
          boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.11)",
          display: "flex",
          flex: "1 1 500px",
          minWidth: 280,
          height: 389,
          padding: 16,
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          gap: 20,
          boxSizing: "border-box"
        }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", width: "100%" }}>
            <span style={{ fontSize: 16, fontWeight: 500, color: "#111827", fontFamily: "Inter, sans-serif" }}>Leads Status Distribution</span>
            <div style={{ display: "flex", gap: 8 }}>
              <div style={{ position: "relative" }}>
                <button 
                  onClick={() => setOpenMembersFilter(openMembersFilter === 'leads-status' ? null : 'leads-status')}
                  style={{ padding: "6px 12px", border: "1px solid #D4D5D8", borderRadius: 8, background: "#FFF", fontSize: 13, color: "#374151", fontFamily: "Inter, sans-serif", cursor: "pointer", display: "flex", alignItems: "center", gap: 4 }}
                >
                  {selectedMember} <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m6 9 6 6 6-6"/></svg>
                </button>
                {openMembersFilter === 'leads-status' && (
                  <div style={{ position: "absolute", top: "100%", right: 0, zIndex: 10, marginTop: 4 }}>
                    <Members_filter 
                      selectedOption={selectedMember} 
                      onChange={(option) => {
                        setSelectedMember(option);
                        setOpenMembersFilter(null);
                      }} 
                      onClickOutside={() => setOpenMembersFilter(null)}
                    />
                  </div>
                )}
              </div>
              <div style={{ position: "relative" }}>
                <button onClick={() => setOpenMonthFilter(openMonthFilter === 'leads-status' ? null : 'leads-status')} style={{ padding: "6px 12px", border: "1px solid #D4D5D8", borderRadius: 8, background: "#FFF", fontSize: 13, color: "#374151", fontFamily: "Inter, sans-serif", cursor: "pointer", display: "flex", alignItems: "center", gap: 4 }}>This month <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m6 9 6 6 6-6"/></svg></button>
                {openMonthFilter === 'leads-status' && (
                  <div style={{ position: "absolute", top: "100%", right: 0, zIndex: 10, marginTop: 4 }}>
                    <Month_filter onChange={() => setOpenMonthFilter(null)} onClickOutside={() => setOpenMonthFilter(null)} />
                  </div>
                )}
              </div>
            </div>
          </div>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart layout="vertical" data={getLeadsData()} margin={{ top: 0, right: 16, left: 60, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" horizontal={false} />
              <XAxis type="number" domain={[0, 100]} tick={{ fontSize: 11, fill: "#6B7280", fontFamily: "Inter, sans-serif" }} />
              <YAxis type="category" dataKey="status" tick={{ fontSize: 11, fill: "#374151", fontFamily: "Inter, sans-serif" }} width={80} />
              <Tooltip />
              <Bar dataKey="value" fill="#00236F" radius={[0, 4, 4, 0]} barSize={18} />
            </BarChart>
          </ResponsiveContainer>
        </div>

      </div>

      {/* Modals */}
      {isTaskDrawerOpen && (
        <div style={{
          position: "fixed",
          top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: "rgba(0, 0, 0, 0.5)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 1000
        }}>
          <Veiw_More_Task onClose={() => setIsTaskDrawerOpen(false)} />
        </div>
      )}

      {isSalesReportOpen && (
        <div style={{
          position: "fixed",
          top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: "rgba(0, 0, 0, 0.5)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 1000
        }}>
          <View_More_Sales_Report onClose={() => setIsSalesReportOpen(false)} />
        </div>
      )}
    </div>
  );
};

export default Overview;

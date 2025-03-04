import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle
} from '@/components/ui/card'
// import { TopNav } from '@/components/layout/top-nav'
import { ProfileDropdown } from '@/components/profile-dropdown'
// import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import { FaithForm } from './components/faith-form'

export default function Dashboard() {
  // const [date, setDate] = useState(null)
  // const [checkList, setCheckList] = useState([])
  
  // useEffect(() => {



  // }, [date])

  // setDate(format(new Date(), "yyyyMMdd"))

  return (
    <>
      {/* ===== Top Heading ===== */}
      <Header>
        {/* <TopNav links={topNav} /> */}
        <div className='ml-auto flex items-center space-x-4'>
          {/* <Search /> */}
          <ThemeSwitch />
          <ProfileDropdown />
        </div>
      </Header>

      {/* ===== Main ===== */}
      <Main>
        <div className='mb-2 flex items-center justify-between space-y-2'>
          <h1 className='text-2xl font-bold tracking-tight'>Dashboard</h1>
        </div>
        <div className='space-y-4'>
            <div className='grid gap-4 grid-cols-1 lg:grid-cols-4'>
              <Card className='col-span-1 lg:col-span-2 xl:col-span-1'>
                <CardHeader>
                  <CardTitle className='text-xl'>신앙점검</CardTitle>
                </CardHeader>
                <CardContent>
                  <FaithForm />
                </CardContent>
              </Card>
              {/* <Card className='col-span-1 xl:col-span-2'>
                <CardHeader>
                  <CardTitle>Recent Sales</CardTitle>
                  <CardDescription>
                    You made 265 sales this month.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <RecentSales />
                </CardContent>
              </Card> */}
            </div>
          </div>
      </Main>
    </>
  )
}

// const topNav = [
//   {
//     title: 'Overview',
//     href: 'dashboard/overview',
//     isActive: true,
//     disabled: false,
//   },
//   {
//     title: 'Customers',
//     href: 'dashboard/customers',
//     isActive: false,
//     disabled: true,
//   },
//   {
//     title: 'Products',
//     href: 'dashboard/products',
//     isActive: false,
//     disabled: true,
//   },
//   {
//     title: 'Settings',
//     href: 'dashboard/settings',
//     isActive: false,
//     disabled: true,
//   },
// ]

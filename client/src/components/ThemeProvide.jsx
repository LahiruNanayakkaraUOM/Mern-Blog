import { useSelector } from "react-redux"

function ThemeProvide({children}) {

    const {activeTheme} = useSelector((state) => state.theme)

  return (
    <div className={activeTheme}>
        <div className="bg-white text-gray-700 dark:text-gray-200 dark:bg-[rgb(16,23,42)] min-h-screen">
        {children}
        </div>
    </div>
  )
}

export default ThemeProvide
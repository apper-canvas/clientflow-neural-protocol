import * as Icons from 'lucide-react'

const ApperIcon = ({ name, ...props }) => {
  const IconComponent = Icons[name]
  
  if (!IconComponent) {
    console.warn(`Icon "${name}" not found in lucide-react`)
    return <Icons.HelpCircle {...props} />
  }
  
  return <IconComponent {...props} />
}

export default ApperIcon
export const admin = [{
    _name: 'CSidebarNav',
    _children: [
        {
            _name: 'CSidebarNavTitle',
            _children: ['Budget']
        },
        {
            _name: 'CSidebarNavItem',
            name: 'Budget Manager',
            to: '/expense-manager',
            icon: 'cil-speedometer',
        },
        {
            _name: 'CSidebarNavItem',
            name: 'Dashboard',
            to: '/dashboard',
            icon: 'cil-speedometer',
        },
        {
            _name: 'CSidebarNavTitle',
            _children: ['Category Manager']
        },
        {
            _name: 'CSidebarNavItem',
            name: 'Income Category',
            to: '/income-category',
            icon: 'cil-speedometer',
        },
        {
            _name: 'CSidebarNavItem',
            name: 'Expense Category',
            to: '/expense-category',
            icon: 'cil-speedometer',
        },
    ]
}]



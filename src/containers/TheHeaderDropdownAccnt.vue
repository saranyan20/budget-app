<template>
    <CDropdown
        inNav
        class="c-header-nav-items"
        placement="bottom-end"
        add-menu-classes="pt-0"
    >
        <template #toggler>
            <CHeaderNavLink>
                <div class="c-avatar">
                    <img
                        src="https://thumbs.dreamstime.com/b/default-avatar-profile-image-vector-social-media-user-icon-potrait-182347582.jpg"
                        class="c-avatar-img "
                    />
                </div>
            </CHeaderNavLink>
        </template>
        <CDropdownHeader tag="div" class="text-center" color="light">
            <strong>Account</strong>
        </CDropdownHeader>

        <CDropdownItem @click="$router.push('profile')">
            <CIcon name="cil-user" /> Profile
        </CDropdownItem>

        <CDropdownItem @click="$router.push('reset')">
            <CIcon name="cil-user" /> Reset
        </CDropdownItem>

        <CDropdownDivider />

        <CDropdownItem @click="logoutHandler">
            <CIcon name="cil-lock-locked" /> Logout
        </CDropdownItem>
    </CDropdown>
</template>

<script>
export default {
    name: 'TheHeaderDropdownAccnt',
    data() {
        return {
            itemsCount: 42
        };
    },
    methods: {
        logoutHandler() {
            return this.$router.push('/login');
        }
    }
};
</script>

<style scoped>
.c-icon {
    margin-right: 0.3rem;
}
</style>

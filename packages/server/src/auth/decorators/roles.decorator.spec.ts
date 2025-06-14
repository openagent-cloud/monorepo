import { Reflector } from '@nestjs/core'
import { ROLES_KEY, Roles } from './auth-decorators'
import { user_role } from '@prisma/client'

describe('Roles Decorator', () => {
  it('should set metadata with ROLES_KEY and provided roles', () => {
    // Setup
    const reflector = new Reflector()

    // Create a test class with the decorator
    @Roles(user_role.admin, user_role.superadmin)
    class TestClass {}

    // Create a test method with the decorator
    class TestMethodClass {
      @Roles(user_role.user)
      testMethod() {}
    }

    // Test class decorator
    const classRoles = reflector.get(ROLES_KEY, TestClass)
    expect(classRoles).toEqual([user_role.admin, user_role.superadmin])

    // Test method decorator
    const methodRoles = reflector.get(ROLES_KEY, TestMethodClass.prototype.testMethod)
    expect(methodRoles).toEqual([user_role.user])
  })

  it('should work with empty roles array', () => {
    const reflector = new Reflector()

    @Roles()
    class EmptyRolesClass {}

    const roles = reflector.get(ROLES_KEY, EmptyRolesClass)
    expect(roles).toEqual([])
  })

  it('should work with multiple roles', () => {
    const reflector = new Reflector()

    @Roles(
      user_role.user,
      user_role.elevated,
      user_role.moderator,
      user_role.admin,
      user_role.superadmin
    )
    class MultipleRolesClass {}

    const roles = reflector.get(ROLES_KEY, MultipleRolesClass)
    expect(roles).toEqual([
      user_role.user,
      user_role.elevated,
      user_role.moderator,
      user_role.admin,
      user_role.superadmin
    ])
  })

  it('should correctly integrate with RolesGuard', () => {
    // This is a bit more of an integration test, but it's important
    // to verify the decorator works with the guard as expected
    const reflector = new Reflector()

    @Roles(user_role.admin)
    class AdminClass {}

    // Simulate how RolesGuard uses the reflector
    const requiredRoles = reflector.get<user_role[]>(ROLES_KEY, AdminClass)

    // Verify the roles can be accessed
    expect(requiredRoles).toContain(user_role.admin)
    expect(requiredRoles).not.toContain(user_role.user)

    // Simulate the RolesGuard check logic
    const adminUser = { role: user_role.admin }
    const regularUser = { role: user_role.user }

    const isAdminAllowed = requiredRoles.some((role) => adminUser.role === role)
    const isUserAllowed = requiredRoles.some((role) => regularUser.role === role)

    expect(isAdminAllowed).toBe(true)
    expect(isUserAllowed).toBe(false)
  })
})

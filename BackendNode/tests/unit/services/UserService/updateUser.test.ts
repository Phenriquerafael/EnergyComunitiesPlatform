const UserService = require('../../../../src/services/userService');
const { Result } = require('../../../../src/core/logic/Result');
const UserEmail = require('../../../../src/domain/user/userEmail');
const PhoneNumber = require('../../../../src/domain/user/phoneNumber');
const UserPassword = require('../../../../src/domain/user/userPassword');
const argon2 = require('argon2');

// Simple mock repositories
const createUserRepoMock = () => ({
  findById: jest.fn(),
  save: jest.fn(),
});

const createRoleRepoMock = () => ({
  findByName: jest.fn(),
});

// Mock logger
const loggerMock = {
  error: jest.fn(),
  silly: jest.fn(),
  info: jest.fn(),
  warn: jest.fn()
};

describe('UserService - updateUser (full test suite)', () => {
  let userService;
  let userRepoMock;
  let roleRepoMock;

  beforeEach(() => {
    userRepoMock = createUserRepoMock();
    roleRepoMock = createRoleRepoMock();
    userService = new UserService(userRepoMock, roleRepoMock, loggerMock);
  });

  it('should return success when user is updated', async () => {
    const mockUser = {
      updateFirstName: jest.fn(),
      updateLastName: jest.fn(),
      updateEmail: jest.fn(),
      updatePhoneNumber: jest.fn(),
      updatePassword: jest.fn(),
      role: { id: { toString: () => 'ADMIN' } },
      isActive: true,
      id: { toString: () => '123' },
      email: { value: 'john@example.com' },
      firstName: { value: 'John' },
      lastName: { value: 'Doe' },
      phoneNumber: { value: '914132345' },
      password: { value: 'hashedPass123' }
    };

    userRepoMock.findById.mockResolvedValue(mockUser);
    userRepoMock.save.mockResolvedValue(undefined);
    roleRepoMock.findByName.mockResolvedValue({
      id: { toString: () => '12345' },
      name: 'ADMIN'
    });

    const result = await userService.updateUser('123', {
      firstName: 'John',
      role: 'ADMIN'
    });

    expect(result.isSuccess).toBe(true);
    expect(userRepoMock.save).toHaveBeenCalled();
  });

  it('should fail when user is not found', async () => {
    userRepoMock.findById.mockResolvedValue(null);

    const result = await userService.updateUser('999', {
      firstName: 'Jane'
    });

    expect(result.isSuccess).toBe(false);
    expect(result.error).toBe('User not found');
  });

  it('should fail when role is not found', async () => {
    const mockUser = {
      updateFirstName: jest.fn(),
      role: { id: { toString: () => 'ADMIN' } },
      isActive: true,
      id: { toString: () => '123' },
      email: { value: 'john@example.com' },
      firstName: { value: 'John' },
      lastName: { value: 'Doe' },
      phoneNumber: { value: '914132345' },
      password: { value: 'hashedPass123' }
    };

    userRepoMock.findById.mockResolvedValue(mockUser);
    roleRepoMock.findByName.mockResolvedValue(null);

    const result = await userService.updateUser('123', {
      role: 'NON_EXISTENT_ROLE'
    });

    expect(result.isSuccess).toBe(false);
    expect(result.error).toBe('Role NON_EXISTENT_ROLE not found');
  });

  it('should not fail if no fields are provided', async () => {
    const mockUser = {
      updateFirstName: jest.fn(),
      updateLastName: jest.fn(),
      updateEmail: jest.fn(),
      updatePhoneNumber: jest.fn(),
      updatePassword: jest.fn(),
      role: { id: { toString: () => 'ADMIN' } },
      isActive: true,
      id: { toString: () => '123' },
      email: { value: 'john@example.com' },
      firstName: { value: 'John' },
      lastName: { value: 'Doe' },
      phoneNumber: { value: '914132345' },
      password: { value: 'hashedPass123' }
    };

    userRepoMock.findById.mockResolvedValue(mockUser);
    userRepoMock.save.mockResolvedValue(undefined);

    const result = await userService.updateUser('123', {});

    expect(result.isSuccess).toBe(true);
    expect(userRepoMock.save).toHaveBeenCalled();
  });

  it('should fail when an unexpected error is thrown', async () => {
    userRepoMock.findById.mockImplementation(() => { throw new Error('DB down'); });

    const result = await userService.updateUser('123', {
      firstName: 'Error Test'
    });

    expect(result.isSuccess).toBe(false);
    expect(result.error).toMatch(/Error updating user: DB down/);
  });

  it('should update all fields when all are provided', async () => {
    const mockUser = {
      updateFirstName: jest.fn(),
      updateLastName: jest.fn(),
      updateEmail: jest.fn(),
      updatePhoneNumber: jest.fn(),
      updatePassword: jest.fn(),
      role: { id: { toString: () => 'ADMIN' } },
      isActive: true,
      id: { toString: () => '123' },
      email: { value: 'john@example.com' },
      firstName: { value: 'John' },
      lastName: { value: 'Doe' },
      phoneNumber: { value: '914132345' },
      password: { value: 'hashedPass123' }
    };

    userRepoMock.findById.mockResolvedValue(mockUser);
    userRepoMock.save.mockResolvedValue(undefined);
    roleRepoMock.findByName.mockResolvedValue({
      id: { toString: () => '456' },
      name: 'ADMIN'
    });

    // ✅ Mock value object factories and argon2
    UserEmail.create = jest.fn().mockReturnValue(Result.ok({ value: 'new@example.com', isValid: () => true }));
    PhoneNumber.create = jest.fn().mockReturnValue(Result.ok({ value: '999888777' }));
    UserPassword.create = jest.fn().mockReturnValue(Result.ok({ value: 'hashed' }));
    argon2.hash = jest.fn().mockResolvedValue('hashed');

    const result = await userService.updateUser('123', {
      firstName: 'Alice',
      lastName: 'Smith',
      email: 'new@example.com',
      phoneNumber: '999888777',
      password: 'plainpassword',
      role: 'ADMIN'
    });

    expect(result.isSuccess).toBe(true);
    expect(userRepoMock.save).toHaveBeenCalled();
  });
});

import { SparkNavBarContext } from './spark-nav-bar-context';

describe('SparkNavBarContext', () => {
    it('should create an instance of SparkNavBarContext', () => {
    // Arrange
        const clientId = 'test-client-id';
        const host = 'test-host';
        const userId = 'test-user-id';

        // Act
        const context = new SparkNavBarContext(clientId, host, userId);

        // Assert
        expect(context).toBeTruthy();
        expect(context.clientId).toBe(clientId);
        expect(context.host).toBe(host);
        expect(context.userId).toBe(userId);
    });

    it('should correctly assign properties via the constructor', () => {
    // Arrange
        const clientId = 'client123';
        const host = 'spark-host';
        const userId = 'user456';

        // Act
        const context = new SparkNavBarContext(clientId, host, userId);

        // Assert
        expect(context.clientId).toEqual(clientId);
        expect(context.host).toEqual(host);
        expect(context.userId).toEqual(userId);
    });
});

import { teardownUtils } from '@fmr-ap167419/shared-qe-automation-util-playwright';
import { join } from 'path';

/**
 * Global teardown function that runs once after all test suites have completed.
 * Resets vault data files containing sensitive authentication information
 */
const globalTeardown = async () => {
  await teardownUtils.resetVaultdataFile(join(__dirname, 'vaultdata.json'));
};

export default globalTeardown;

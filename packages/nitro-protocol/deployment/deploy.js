const Commitment = require('../build/contracts/Commitment');
const Rules = require('../build/contracts/Rules');
// const CountingCommitment = require('../build/contracts/CountingCommitment');
// const CountingApp = require('../build/contracts/CountingApp');
// const ConsensusCommitment = require('../build/contracts/ConsensusCommitment');
// const ConsensusApp = require('../build/contracts/ConsensusApp');
const NitroAdjudicator = require('../build/contracts/NitroAdjudicator');
const SafeMath = require('../build/contracts/SafeMath');

const {GanacheDeployer} = require('@statechannels/devtools');

const deploy = async () => {
  const deployer = new GanacheDeployer(Number(process.env.GANACHE_PORT));

  const COMMITMENT_ADDRESS = await deployer.deploy(Commitment);
  const RULES_ADDRESS = await deployer.deploy(Rules, {Commitment: COMMITMENT_ADDRESS});
  // const COUNTING_COMMITMENT_ADDRESS = await deployer.deploy(CountingCommitment, {
  //   Commitment: COMMITMENT_ADDRESS,
  // });
  // const COUNTING_APP_ADDRESS = await deployer.deploy(CountingApp, {
  //   Commitment: COMMITMENT_ADDRESS,
  //   Rules: RULES_ADDRESS,
  //   CountingCommitment: COUNTING_COMMITMENT_ADDRESS,
  // });
  // const CONSENSUS_COMMITMENT_ADDRESS = await deployer.deploy(ConsensusCommitment, {
  //   Commitment: COMMITMENT_ADDRESS,
  // });
  // const CONSENSUS_APP_ADDRESS = await deployer.deploy(ConsensusApp, {
  //   Commitment: COMMITMENT_ADDRESS,
  //   Rules: RULES_ADDRESS,
  //   ConsensusCommitment: CONSENSUS_COMMITMENT_ADDRESS,
  // });

  const SAFE_MATH_ADDRESS = await deployer.deploy(SafeMath);
  const NITRO_ADJUDICATOR_ADDRESS = await deployer.deploy(NitroAdjudicator, {
    Commitment: COMMITMENT_ADDRESS,
    Rules: RULES_ADDRESS,
    SafeMath: SAFE_MATH_ADDRESS,
  });

  return {
    COMMITMENT_ADDRESS,
    RULES_ADDRESS,
    // COUNTING_APP_ADDRESS,
    // COUNTING_COMMITMENT_ADDRESS,
    // CONSENSUS_COMMITMENT_ADDRESS,
    // CONSENSUS_APP_ADDRESS,
    SAFE_MATH_ADDRESS,
    NITRO_ADJUDICATOR_ADDRESS,
  };
};

module.exports = {
  deploy,
};

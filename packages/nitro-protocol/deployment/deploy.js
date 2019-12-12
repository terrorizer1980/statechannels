const Commitment = require('../build/contracts/Commitment.json');
const Rules = require('../build/contracts/Rules.json');
const CountingCommitment = require('../build/contracts/CountingCommitment.json');
const CountingApp = require('../build/contracts/CountingApp.json');
const ConsensusCommitment = require('../build/contracts/ConsensusCommitment.json');
const ConsensusApp = require('../build/contracts/ConsensusApp.json');
const NitroAdjudicator = require('../build/contracts/NitroAdjudicator.json');
const SafeMath = require('../build/contracts/SafeMath.json');

const {GanacheDeployer} = require('@statechannels/devtools');

const deploy = async () => {
  const deployer = new GanacheDeployer(Number(process.env.GANACHE_PORT));

  const COMMITMENT_ADDRESS = deployer.deploy(Commitment);
  const RULES_ADDRESS = deployer.deploy(Rules, {Commitment: COMMITMENT_ADDRESS});
  const COUNTING_COMMITMENT_ADDRESS = deployer.deploy(CountingCommitment, {
    Commitment: COMMITMENT_ADDRESS,
  });
  const COUNTING_APP_ADDRESS = deployer.deploy(CountingApp, {
    Commitment: COMMITMENT_ADDRESS,
    Rules: RULES_ADDRESS,
    CountingCommitment: COUNTING_COMMITMENT_ADDRESS,
  });
  const CONSENSUS_COMMITMENT_ADDRESS = deployer.deploy(ConsensusCommitment, {
    Commitment: COMMITMENT_ADDRESS,
  });
  const CONSENSUS_APP_ADDRESS = deployer.deploy(ConsensusApp, {
    Commitment: COMMITMENT_ADDRESS,
    Rules: RULES_ADDRESS,
    ConsensusCommitment: CONSENSUS_COMMITMENT_ADDRESS,
  });

  const SAFE_MATH_ADDRESS = deployer.deploy(SafeMath);
  const NITRO_ADJUDICATOR_ADDRESS = deployer.deploy(NitroAdjudicator, {
    Commitment: COMMITMENT_ADDRESS,
    Rules: RULES_ADDRESS,
    SafeMath: SAFE_MATH_ADDRESS,
  });

  return {
    COMMITMENT_ADDRESS,
    RULES_ADDRESS,
    COUNTING_APP_ADDRESS,
    COUNTING_COMMITMENT_ADDRESS,
    CONSENSUS_COMMITMENT_ADDRESS,
    CONSENSUS_APP_ADDRESS,
    SAFE_MATH_ADDRESS,
    NITRO_ADJUDICATOR_ADDRESS,
  };
};

module.exports = {
  deploy,
};

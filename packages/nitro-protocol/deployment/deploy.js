const Commitment = require('../build/contracts/Commitment.json');
const Rules = require('../build/contracts/Rules.json');
const CountingCommitment = require('../build/contracts/CountingCommitment.json');
const CountingApp = require('../build/contracts/CountingApp.json');
const ConsensusCommitment = require('../build/contracts/ConsensusCommitment.json');
const ConsensusApp = require('../build/contracts/ConsensusApp.json');
const TestConsensusCommitment = require('../build/contracts/test-contracts/TestConsensusCommitment.json');

const {GanacheDeployer} = require('@statechannels/devtools');

module.exports = function(deployer) {};

const deploy = async () => {
  const deployer = new GanacheDeployer(Number(process.env.GANACHE_PORT));

  const COMMITMENT_ADDRESS = deployer.deploy(Commitment);
  const COUNTING_COMMITMENT_ADDRESS = deployer.deploy(CountingCommitment, {Commitment: Commitment});
  const COUNTING_APP_ADDRESS = deployer.deploy(CountingApp, {
    Commitment: Commitment,
    Rules: Rules,
    CountingCommitment: CountingCommitment,
  });
  const CONSENSUS_COMMITMENT_ADDRESS = deployer.deploy(ConsensusCommitment, {
    Commitment: Commitment,
  });
  const CONSENSUS_APP_ADDRESS = deployer.deploy(ConsensusApp, {
    Commitment: Commitment,
    Rules: Rules,
    CountingCommitment: CountingCommitment,
  });

  return {
    COMMITMENT_ADDRESS,
    COUNTING_APP_ADDRESS,
    COUNTING_COMMITMENT_ADDRESS,
    CONSENSUS_COMMITMENT_ADDRESS,
    CONSENSUS_APP_ADDRESS,
  };
};

module.exports = {
  deploy,
};

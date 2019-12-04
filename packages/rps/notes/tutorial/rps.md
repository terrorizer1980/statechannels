# How to build a ForceMove state channel application (by example)

- Part 0 [**Introduction**](#Introduction)
  - Why care?
  - Succint definition of FMApp
  - Explanation of tutorial structure
- Part 1 [**Fundamentals**](#Fundamentals)
  - Understanding State Channels
  - Understanding ForceMove & Nitro split(Outcomes and AssetHolders)
  - Primacy of `validTransition` state machine
    - Difficult to convert a DApp without considering from ground up starting with `ForceMoveApp` contract.
    - Economic incentives
  - ForceMove in more detail
    - Setup states
    - Concluding
- Part 2 [**Manual statechannel**](#Running-a-statechannel-manually)
  - What our wallet will do for you
    - validate state transitions
    - enable various funding routes
  - Encoding / Decoding
  - Choosing an asset type
    - single assets
    - multi assets (future post)
- Part 3 [**Wrapping statechannel in app**](#An-example-statechannel-application)
  - Peer-to-peer nature
  - Maintaining state (e.g. redux)
  - Asynchronous stuff (e.g. redux-saga)
    - Ethereum wallet (e.g. MetaMask)
    - Wallet API (e.g. JSON-RPC)
    - Communication (e.g. firebase)
  - Front end (e.g. react)
    - UX challenging as in DApps
  - Coming soon: web3Torrent

# Introduction

## Why should I care

## What is a state channel application?

## Structure of this tutorial

# Fundamentals

## Understanding state channels

## A split between outcomes and asset transferal

## Key Concept: your implementation of the `ForceMoveApp` contract interface

Don't try and channelize your app without rethinking it from the ground up, with this contract as the focus.

## Wider ForceMove protocol

Setup and teardown of the channel

# Running a statechannel manually

e.g. through email or IM

## What our wallet will do for you

## Encoding / Deocding

Just go with the abi encoder

## Asset types

We can just go with ETH for now

# An example statechannel application

## Peer-to-peer

Breaks typical web dev paradigms.

## Maintiaining state

Redux

## Asynchronous stuff

ETH wallet.
SC wallet.
Comms.

## Front end

Just a bit of polish. UX still a challenge.

## Comins soon

web3torrent.

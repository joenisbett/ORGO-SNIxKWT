import * as Kilt from '@kiltprotocol/sdk-js'
import { mnemonicGenerate, mnemonicToMiniSecret } from '@polkadot/util-crypto'
import KiltAccount from '../models/kiltModel.js'
import CtypeAccount from '../models/cTypeModel.js'
// The type to filter the endpoints of the retrieved DID.
const PUBLISHED_CREDENTIAL_COLLECTION_V1_TYPE = 
  'KiltPublishedCredentialCollectionV1'
const verifyCredential = async (
  publishedCredential
) => {
  // Retrieve the on-chain attestation information about the credential.
  const onChainAttestation = await Kilt.Attestation.query(
    publishedCredential.rootHash
  )
  if (!onChainAttestation || onChainAttestation.revoked) {
    return false
  }
  // Verify the credential integrity and the subject's signature.
  return (
    publishedCredential.verifyData() && publishedCredential.verifySignature()
  )
}

export async function createFullDid(user
) {
  await Kilt.connect( 'wss://peregrine.kilt.io/parachain-public-ws' )

  const api = Kilt.ConfigService.get('api')
 
  const kiltAccount = await KiltAccount.findOne({user:user})
  const mnemonic =kiltAccount.mneumonics


  const account = await getAccount(mnemonic)
  

  const { authentication, encryption, attestation, delegation } = await generateKeypairs(mnemonic)

  const fullDidCreationTx = await Kilt.Did.getStoreTx(
    {
      authentication: [authentication],
      keyAgreement: [encryption],
      assertionMethod: [attestation],
      capabilityDelegation: [delegation],
    },

    account.address,
    async ({ data }) => ({
      signature: authentication.sign(data),
      keyType: authentication.type,
    })
  )
  await Kilt.Blockchain.signAndSubmitTx(fullDidCreationTx, account)

  const didUri = Kilt.Did.getFullDidUriFromKey(authentication)
  const encodedFullDid = await api.call.did.query(Kilt.Did.toChain(didUri))
  const { document } = Kilt.Did.linkedInfoFromChain(encodedFullDid)

  if (!document) {
    throw 'Full DID was not successfully created.'
  }

  const kilt_account = await KiltAccount.findOne({user:user})
  if(kilt_account){
    kilt_account.fullDid=document
    kilt_account.save()
    
  }

  return {  fullDid: document }
}

export async function generateAccount(id) {

  await Kilt.init({  address: 'wss://peregrine.kilt.io/parachain-public-ws' })

  // setup keyring
  const keyring = new Kilt.Utils.Keyring({
    ss58Format: 38,
    type: 'sr25519'
  })

  // use the mnemonic from .env or make a new one
  const mnemonic =await mnemonicGenerate()
  const account =await keyring.addFromMnemonic(mnemonic)
  const kiltAccount =await new KiltAccount({
    user:id,
  accountDetails:account,
  mneumonics:mnemonic

  })
  kiltAccount.save()
  return { account, mnemonic }
}

export async function claimWeb3Name(
  keystore,
  did,
  submitterAccount,
  name,
  resolveOn = Kilt.BlockchainUtils
    .IS_FINALIZED
) {
  const web3NameClaimTx = await Kilt.Did.Web3Names.getClaimTx(name).then((tx) =>
    did.authorizeExtrinsic(tx, keystore, submitterAccount.address)
  )
  await Kilt.BlockchainUtils.signAndSubmitTx(
    web3NameClaimTx,
    submitterAccount,
    {
      resolveOn
    }
  )
}

// export async function getPublicCredentials(

//   web3Name
// ) {
//     await Kilt.init({ address: 'wss://peregrine.kilt.io/parachain-public-ws' })
    
//     const didForWeb3Name = await Kilt.Did.Web3Names.queryDidForWeb3Name("codevibek")
    

//   if (!didForWeb3Name) {
//     throw `No DID found for "${didForWeb3Name}"`
//   }

//   console.log(`DID for "${web3Name}": ${didForWeb3Name}`)

//   const resolutionResult = await Kilt.Did.resolveDoc(didForWeb3Name)
//   if (!resolutionResult) {
//     throw 'The DID does not exist on the KILT blockchain.'
//   }

//   const didDetails = resolutionResult.details
//   // If no details are returned but resolutionResult is not null, the DID has been deleted.
//   // This information is present in `resolutionResult.metadata.deactivated`.
//   if (!didDetails) {
//     throw 'The DID has already been deleted.'
//   }

//   // Filter the endpoints by their type.
//   const didEndpoints = didDetails.getEndpoints(
//     PUBLISHED_CREDENTIAL_COLLECTION_V1_TYPE
//   )

//   console.log(
//     `Endpoints of type "${PUBLISHED_CREDENTIAL_COLLECTION_V1_TYPE}" for the retrieved DID:`
//   )
//   console.log(JSON.stringify(didEndpoints, null, 2))

//   // For demonstration, only the first endpoint and its first URL are considered.
//   const firstCredentialCollectionEndpointUrl = didEndpoints[0]?.urls[0]
//   if (!firstCredentialCollectionEndpointUrl) {
//     console.log(
//       `The DID has no service endpoints of type "${PUBLISHED_CREDENTIAL_COLLECTION_V1_TYPE}".`
//     )
//   }

//   // Retrieve the credentials pointed at by the endpoint.
//   // Being an IPFS endpoint, the fetching can take an arbitrarily long time or even fail if the timeout is reached.
//   // The case where the result is not a JSON should be properly handled in production settings.
//   const credentialCollection = await fetch(
//     firstCredentialCollectionEndpointUrl
//   ).then((response) => response.json())
//   console.log(`Credential collection behind the endpoint:`)
//   console.log(JSON.stringify(credentialCollection, null, 2))

//   // Verify that all credentials are valid and that they all refer to the same DID.
//   await Promise.all(
//     credentialCollection.map(async ({ credential }) => {
//       const credentialInstance =
//         Kilt.RequestForAttestation.fromRequest(credential)
//       // Verify the credential integrity and signature, according to the KILT specification.
//       const credentialStatus = await verifyCredential(credentialInstance)
//       if (!credentialStatus) {
//         throw 'Integrity and signature checks have failed for one of the credentials.'
//       }

//       // Verify that the credential refers to the intended subject
//       if (
//         !Kilt.Did.Utils.isSameSubject(credential.claim.owner, didForWeb3Name)
//       ) {
//         throw 'One of the credentials refers to a different subject than expected.'
//       }
//     })
//   )

//   // If no promise is rejected, all the checks have successfully completed.
//   console.log('All retrieved credentials are valid! ✅!')

//   return credentialCollection
// }

export async function getCtypeSchema() {

  
      return Kilt.CType.fromProperties(
        
        // `Drivers License `, {
        //   name: {
        //     type: 'string',
        //   },
      
        //   age: {
        //     type: 'integer',
        //   },
      
        //   id: {
        //     type: 'string',
        //   },
        // }
        `Task Completion`,{
        
          taskName: {
            type: 'string'
          },
          evidenceName: {
            type: 'string'
          },
          data: {
            type: 'string'
          },
          username: {
            type: 'string'
          },
          templateId:{
            type:"string"
          },
          completedDate:{
            type:"string"
          },
          approvedDate:{
            type:"string"
          },
          helpers:{
            type:"string"
          },

    }
    
    )

  }

  export async function getAccount() {
    await Kilt.init({ address: process.env.WSS_ADDRESS })
    const keyring = new Kilt.Utils.Keyring({
      ss58Format: 38,
      type: 'sr25519'
    })
    return keyring.addFromMnemonic("border pair hedgehog best trust ill cart laugh flash stool sun tube")
  }

  export async function getFullDid(
    didUri
  ) {
    await Kilt.init({ address: 'wss://peregrine.kilt.io/parachain-public-ws' })

    // make sure the did is already on chain
    const onChain = await Kilt.Did.FullDidDetails.fromChainInfo(didUri)
    if (!onChain) throw Error(`failed to find on chain did: ${didUri}`)
    return onChain
  }
  
  export async function generateKeypairs(mnemonic) {
    const authentication = Kilt.Utils.Crypto.makeKeypairFromSeed(
      mnemonicToMiniSecret(mnemonic)
    )
  
    const encryption = Kilt.Utils.Crypto.makeEncryptionKeypairFromSeed(
      mnemonicToMiniSecret(mnemonic)
    )
  
    const attestation = authentication.derive('//attestation')
  
    const delegation = authentication.derive('//delegation')
  
    return {
      authentication,
      encryption,
      attestation,
      delegation,
    }
  }

  export async function createCType(user,template) {
    await Kilt.connect('wss://peregrine.kilt.io/parachain-public-ws' )
    const kiltAccount = await KiltAccount.findOne({user:user})
    const mnemonic = kiltAccount.mneumonics
    const did = kiltAccount.fullDid.uri
   
    //Load Account
    const account = await getAccount(mnemonic)
// console.log(mnemonic,kiltAccount)
    let key=
    await generateKeypairs(mnemonic) 
    const {encryption, attestation,authentication,delegation} = key
    console.log({encryption, attestation,authentication,delegation})
console.log(attestation)
    const api = Kilt.ConfigService.get('api')

   // get the CTYPE and see if it's stored, if yes return it
   let ctype  = await getCtypeSchema()
   const ctypeCreationTx = api.tx.ctype.add(Kilt.CType.toChain(ctype))

  
const newCtype = new CtypeAccount({userId:user,ctype:JSON.stringify(ctype)})
await newCtype.save()

try {
  await Kilt.CType.verifyStored(ctype)
  console.log('Ctype already stored. Skipping creation')
  return ctype
} catch {
  console.log('Ctype not present. Creating it now...')
  // Authorize the tx.
  const encodedCtype = Kilt.CType.toChain(ctype)

  console.log("here")

  const tx = api.tx.ctype.add(encodedCtype)
  const extrinsic = await Kilt.Did.authorizeTx(
    did,
    tx,
    async ({ data }) => ({
      signature: attestation.sign(data),
      keyType: attestation.type
    }),
    account.address
  )

  // Write to chain then return the CType.
  await Kilt.Blockchain.signAndSubmitTx(extrinsic, account)

  return ctype
}

  }

  async function requestFromClaim(
    lightDid,
    keystore,
    claim
  ){
    const request = Kilt.RequestForAttestation.fromClaim(claim)
    await request.signWithDidKey(
      keystore,
      lightDid,
      lightDid.authenticationKey.id
    )

    return request
  }

  export async function generateLightDid(mneumonic){
  

    let {  authentication,encryption } =await
  generateKeypairs(mneumonic)
    // init
    await Kilt.connect( 'wss://peregrine.kilt.io/parachain-public-ws' )
  
    const service = [
      {
        id: '#my-service',
        type: ['KiltPublishedCredentialCollectionV1'],
        serviceEndpoint: ['http://example.domain.org'],
      },
    ]
  
    // Create the KILT light DID with the information generated.
    const lightDID = Kilt.Did.createLightDidDocument({
      authentication: [authentication],
      keyAgreement: [encryption],
      service,
    })
  
  
    return lightDID
      
    
  }

  export async function createClaim(lightDid, ctype,claimAttributes){
    const claim = Kilt.Claim.fromCTypeAndClaimContents(
     ctype,
     claimAttributes,
      lightDid
    )
    return claim
  }

  export async function generateCredentials(user,claimAttributes){
    // The claimer generates the claim they would like to get attested.
    await Kilt.connect( 'wss://peregrine.kilt.io/parachain-public-ws' )

   const kiltAccount = await KiltAccount.findOne({user:user})

   const claimerDid =await generateLightDid(kiltAccount.mneumonics)
console.log(claimerDid)
   const ctype =await  getCtypeSchema()
  const claim =await createClaim(claimerDid.uri, ctype, claimAttributes)
console.log(claim)
  return Kilt.Credential.fromClaim(claim)

  }

 
  export async function attestClaim(
   attesterId,credential
  ) {

    // Init
    await Kilt.connect('wss://peregrine.kilt.io/parachain-public-ws' )
    // load account & DID
    //attester did and mneumonic
    const kiltAccount = await KiltAccount.findOne({user:attesterId})
    console.log(kiltAccount)
    const mnemonic = kiltAccount.mneumonics

    const attesterDid = kiltAccount.fullDid.uri
    const account = await getAccount(mnemonic)

    const api = Kilt.ConfigService.get('api')

    // Get CType and root hash from the provided credential.
    const { cTypeHash, claimHash } =await Kilt.Attestation.fromCredentialAndDid(
      credential,
      attesterDid
    )
     // Create the tx and authorize it.
  const tx = api.tx.attestation.add(claimHash, cTypeHash, null)
  let {  attestation } =await generateKeypairs(mnemonic)

  const extrinsic = await Kilt.Did.authorizeTx(
    attesterDid,
    tx,
    async ({ data }) => ({
      signature: attestation.sign(data),
      keyType: attestation.type
    }),
    account.address
  )

  // Submit the tx to write the attestation to the chain.
  console.log('Attester -> create attestation...')
  const attestationToChain = await Kilt.Blockchain.signAndSubmitTx(extrinsic, account)
  console.log(attestationToChain)
  return credential
   
  }
  export async function getCredential(
    request,attestation
   ) {
    console.log("this")
    const credential = Kilt.Credential.fromRequestAndAttestation(
      request,
      attestation
    )
    var fs = require('fs');
fs.writeFile("thing.json", credential);
    return credential
   }

export async function attestingFlow(user,attesterName){
  // first the claimer
  const request = await   generateCredentials(user,{
    name: 'Alice',
    age: 29,
    id: '123456789987654321'
  },)

  // send the request to the attester 🕊
console.log("gothere")
  // the attester checks the attributes and issues an attestation
  const attestation = await attestClaim(attesterName,request)

  // send the attestation back to the claimer 🕊

  // build the credential and return it
  const credential = Kilt.Credential.fromRequestAndAttestation(
    request,
    attestation
  )

  return credential
}

export async function createPresentation(user,
  credentialObj,
){
const  kiltAccount  = await KiltAccount.findOne({user:user})
  const keystore = new Kilt.Did.DemoKeystore()
  const keys = await generateKeypairs(keystore, kiltAccount.mnemonics)
  const lightDid = Kilt.Did.LightDidDetails.fromDetails({
    ...keys,
    authenticationKey: {
      publicKey: keys.authenticationKey.publicKey,
      type: Kilt.VerificationKeyType.Sr25519
    }
  })


  // creates a Credential from object
  const credential = new Kilt.Credential(credentialObj)
console.log(credential)
  const challenge = getChallenge()

  // creates the presentation from credential, keystore, did and challenge
  const presentation = await credential.createPresentation({
    signer: keystore,
    claimerDid: lightDid,
    challenge: challenge
  })

  return presentation
}

// verifies validity, ownership & attestation
export async function verifyPresentation(
  presentation,
  challenge
){
  const credential = new Kilt.Credential(presentation)

  const isValid = await credential.verify({ challenge })
  const isRevoked = credential.attestation.revoked

  // Custom logic
  // e.g., only allow access if age >= 18

  return isValid && !isRevoked
}

function getChallenge() {
  return Kilt.Utils.UUID.generate()
}
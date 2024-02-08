const express = require("express");
const { Connection, Keypair, PublicKey } = require("@solana/web3.js");
const {
  Metaplex,
  keypairIdentity,
  bundlrStorage,
  Nft,
  Sft,
} = require("@metaplex-foundation/js");
const cors = require("cors");
const bs58 = require("bs58");
const corsOptions = {
  origin: [
    "http://localhost:3000",
    "http://localhost:8080",
    "http://localhost:3001",
    "http://127.0.0.1:3000",
    "http://127.0.0.1:3001",
    "http://127.0.0.1:5077",
    "http://localhost:4321",
    "http://localhost:5078",
    "http://localhost:5077",
    "https://bread.loaf.cat/",
    "https://mrrr.loaf.cat",
  ],
  optionsSuccessStatus: 200,
  // allowedHeaders: ['Content-Type'],
};
const app = express();
app.use(cors(corsOptions));
app.options("*", cors(corsOptions));

app.use(express.json());

app.post("/refresh-metadata", async (req, res) => {
  try {
    const secret = "SECRET_KEY_HERE";
    const secretArray = bs58.decode(secret);
    const wallet = Keypair.fromSecretKey(new Uint8Array(secretArray));
    const connection = new Connection("https://api.mainnet-beta.solana.com"); //https://multi-blissful-wind.solana-mainnet.quiknode.pro/13fc50b03434c8775643c0ae2d3db06e6162d1ef
    const metaplex = Metaplex.make(connection)
      .use(keypairIdentity(wallet))
      .use(
        bundlrStorage({
          address: "https://node1.irys.xyz",
          providerUrl: "https://api.mainnet-beta.solana.com", //https://multi-blissful-wind.solana-mainnet.quiknode.pro/13fc50b03434c8775643c0ae2d3db06e6162d1ef
          timeout: 60000,
        })
      );

    const mintAddress = "2LJPjK1oePi2QWNxn8UCXDJ9RQ2ncAjH5mUVpHvBXnjC"; // req.body nftAddrr
    const nft = await metaplex
      .nfts()
      .findByMint({ mintAddress: new PublicKey(mintAddress) });
    if (!nft || !nft.json?.image) {
      throw new Error("Unable to find existing NFT or image URI");
    }

    const newMetadata = {
      imgType: "image/png",
      imgName: "KAIL #4001",
      description: "KAIL description!",
      attributes: [
        { trait_type: "Speed", value: "Quicker" },
        { trait_type: "Type", value: "Pixelated" },
        { trait_type: "Background", value: "New Background" },
        { trait_type: "Health", value: "100" },
        { trait_type: "Cleanliness", value: "30" },
        { trait_type: "Mental Health", value: "86.766" },
      ],
    };

    const newUri = await uploadMetadata(
      metaplex,
      nft.json.image,
      newMetadata.imgType,
      newMetadata.imgName,
      newMetadata.description,
      newMetadata.attributes
    );
    await updateNft(metaplex, nft, newUri, newMetadata.imgName);

    res.status(200).json({ message: "NFT metadata updated successfully" });
  } catch (error) {
    console.error("Error updating metadata:", error);
    res.status(500).json({ error: "Failed to update metadata" });
  }
});

app.get("/wallet-nfts/:walletAddress", async (req, res) => {
  try {
    const walletAddress = req.params.walletAddress;
    const connection = new Connection(
      "https://multi-blissful-wind.solana-mainnet.quiknode.pro/13fc50b03434c8775643c0ae2d3db06e6162d1ef"
    );
    const metaplex = Metaplex.make(connection)
      .use(keypairIdentity(walletAddress))
      .use(
        bundlrStorage({
          address: "https://node1.irys.xyz",
          providerUrl:
            "https://multi-blissful-wind.solana-mainnet.quiknode.pro/13fc50b03434c8775643c0ae2d3db06e6162d1ef",
          timeout: 60000,
        })
      );

    const mintAddress = "2LJPjK1oePi2QWNxn8UCXDJ9RQ2ncAjH5mUVpHvBXnjC"; // req.body nftAddrr
    const nftsMetadata = await metaplex
      .nfts()
      .findByMint({ mintAddress: new PublicKey(mintAddress) });
    //const nftsMetadata = await Metadata.findDataByOwner(connection, new PublicKey(walletAddress));
    res.status(200).json(nftsMetadata);
  } catch (error) {
    console.error("Error fetching NFTs:", error);
    res.status(500).json({ error: "Failed to fetch NFTs" });
  }
});

const uploadMetadata = async (
  metaplex,
  imgUri,
  imgType,
  nftName,
  description,
  attributes
) => {
  const { uri } = await metaplex.nfts().uploadMetadata({
    name: nftName,
    description: description,
    image: imgUri,
    attributes: attributes,
    properties: {
      files: [{ type: imgType, uri: imgUri }],
    },
  });
  return uri;
};

const updateNft = async (metaplex, nft, metadataUri, newName) => {
  await metaplex.nfts().update(
    {
      name: newName,
      nftOrSft: nft,
      uri: metadataUri,
    },
    { commitment: "finalized" }
  );
};

const port = 3001;
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});

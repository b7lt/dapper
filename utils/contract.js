import { getContract, prepareContractCall, prepareEvent } from "thirdweb";
import { useReadContract, useSendTransaction, useContractEvents} from "thirdweb/react";
// import { bscTestnet } from "thirdweb/chains";
import { client, testBNB } from "./ThirdwebClient";
import { ABI } from "./abi";

const CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_DAPPER_CONTRACT_ADDRESS;

// Thirdweb docs helped a lot
// https://portal.thirdweb.com/react/v5/transactions
// https://portal.thirdweb.com/react/v5/reading-state

// init contract
export const dapperContract = getContract({
  client,
  chain: testBNB,
  address: CONTRACT_ADDRESS,
  abi: ABI,
});

// writes
export function useCreateProfile() {
  const { mutateAsync: sendTransaction, isLoading, error } = useSendTransaction();
  
  const createProfile = async ({ username, displayName, avatarUri, bannerUri }) => {
    const transaction = prepareContractCall({
      client: client,
      dapperContract,
      method: "createProfile",
      params: [username, displayName, avatarUri, bannerUri]
    });
    
    return sendTransaction({ transaction, chain: testBNB });
  };
  
  return { createProfile, isLoading, error };
}

export function useUpdateProfile() {
  const { mutateAsync: sendTransaction, isLoading, error } = useSendTransaction();
  
  const updateProfile = async ({ displayName, avatarUri, bannerUri }) => {
    const transaction = prepareContractCall({
      client: client,
      dapperContract,
      method: "updateProfile",
      params: [displayName, avatarUri, bannerUri],
    })
    
    return sendTransaction({ transaction, chain: testBNB });
  };
  
  return { updateProfile, isLoading, error };
}

export function useCreatePost() {
  const { mutateAsync: sendTransaction, isLoading, error } = useSendTransaction();
  
  const createPost = async ({ contentUri, hasImage, replyTo = 0 }) => {
    const transaction = prepareContractCall({
      contract: dapperContract,
      method: "createPost",
      params: [contentUri, hasImage, replyTo],
    });
    
    return sendTransaction({ transaction, chain: testBNB, client: client });
  };
  
  return { createPost, isLoading, error };
}

export function useLikePost() {
  const { mutateAsync: sendTransaction, isLoading, error } = useSendTransaction();
  
  const likePost = async ({ postId }) => {
    const transaction = prepareContractCall({
      client: client,
      contract: dapperContract,
      method: "likePost",
      params: [postId]
    });
    
    return sendTransaction({ transaction, chain: testBNB });
  };
  
  return { likePost, isLoading, error };
}

export function useUnlikePost() {
  const { mutateAsync: sendTransaction, isLoading, error } = useSendTransaction();
  
  const unlikePost = async ({ postId }) => {
    const transaction = prepareContractCall({
      client: client,
      contract: dapperContract,
      method: "unlikePost",
      params: [postId]
    });
    
    return sendTransaction({ transaction, chain: testBNB });
  };
  
  return { unlikePost, isLoading, error };
}

export function useFollowUser() {
  const { mutateAsync: sendTransaction, isLoading, error } = useSendTransaction();
  
  const followUser = async ({ userToFollow }) => {
    const transaction = prepareContractCall({
      client: client,
      contract: dapperContract,
      method: "followUser",
      params: [userToFollow]
    });
    
    return sendTransaction({ transaction, chain: testBNB });
  };
  
  return { followUser, isLoading, error };
}

export function useUnfollowUser() {
  const { mutateAsync: sendTransaction, isLoading, error } = useSendTransaction();
  
  const unfollowUser = async ({ userToUnfollow }) => {
    const transaction = prepareContractCall({
      client: client,
      contract: dapperContract,
      method: "unfollowUser",
      params: [userToUnfollow]
    });
    
    return sendTransaction({ transaction, chain: testBNB });
  };
  
  return { unfollowUser, isLoading, error };
}

// reads
export function useUserProfile(address) {
  const { data, isLoading, error } = useReadContract({
    contract: dapperContract,
    method: "getUserProfile",
    params: [address]
  });
  
  return { profile: data, isLoading, error };
}

export function useUserPosts(address) {
  const { data, isLoading: postsLoading, error: postsError } = useReadContract({
    contract: dapperContract,
    method: "getUserPosts",
    params: [address]
  });
  
  return { postIds: data, postsLoading, postsError };
}

export function usePost(postId) {
  const { data, isLoading, error } = useReadContract({
    client: client,
    contract: dapperContract,
    method: "getPost",
    params: [postId]
  });
  
  return { post: data, isLoading, error };
}

export function useHasLiked(userAddress, postId) {
  const { data, isLoading, error } = useReadContract({
    contract: dapperContract,
    method: "checkLiked",
    params: [userAddress, postId]
  });
  
  return { hasLiked: data, isLoading, error };
}

export function useFollowers(address) {
  const { data, isLoading, error } = useReadContract({
    contract: dapperContract,
    method: "getFollowers",
    params: [address]
  });
  
  return { followers: data, isLoading, error };
}

export function useFollowing(address) {
  const { data, isLoading, error } = useReadContract({
    contract: dapperContract,
    method: "getFollowing",
    params: [address]
  });
  
  return { following: data, isLoading, error };
}

export function useIsFollowing(followerAddress, followedAddress) {
  const { data, isLoading, error } = useReadContract({
    contract: dapperContract,
    method: "checkFollowing",
    params: [followerAddress, followedAddress]
  });
  
  return { isFollowing: data, isLoading, error };
}

export function useAllPosts() {
  const event = prepareEvent({
    signature: "event PostCreated(uint256 indexed postId, address indexed author, string contentURI, uint256 timestamp)",
  })

  const { data: events, isLoading } = useContractEvents({
    client: client,
    contract: dapperContract,
    eventName: [event],
    queryOptions: {
      fromBlock: 0n, // start from beginning
    },
  });
  
  return { events, isLoading };
}

export function usePostReplies(postId) {
  const { data, isLoading, error } = useReadContract({
    client: client,
    contract: dapperContract,
    method: "getReplies",
    params: [postId]
  });

  return { replyIds: data, isLoading, error };
}

export function usePostRepliedEvents(postId) {
  const event = prepareEvent({
    signature: "event PostReplied(uint256 indexed postId, uint256 indexed replyId, address indexed replier);"
  })

  const { data: events, isLoading } = useContractEvents({
    contract: dapperContract,
    eventName: [event],
    queryOptions: {
      filters: {
        postId: postId
      },
      fromBlock: 0n,
    },
  });
  
  return { events, isLoading };
}
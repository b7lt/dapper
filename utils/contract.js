import { getContract, prepareContractCall, prepareEvent } from "thirdweb";
import { useReadContract, useSendTransaction, useContractEvents} from "thirdweb/react";
// import { bscTestnet } from "thirdweb/chains";
import { client, testBNB } from "./ThirdwebClient";

const CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_DAPPER_CONTRACT_ADDRESS;

// Thirdweb docs helped a lot
// https://portal.thirdweb.com/react/v5/transactions
// https://portal.thirdweb.com/react/v5/reading-state

// init contract
export const dapperContract = getContract({
  client,
  chain: testBNB,
  address: CONTRACT_ADDRESS,
});

// writes
export function useCreateProfile() {
  const { mutateAsync: sendTransaction, isLoading, error } = useSendTransaction();
  
  const createProfile = async ({ username, displayName, avatarUri, bannerUri }) => {
    const transaction = prepareContractCall({
      client: client,
      dapperContract,
      method: "function createProfile(string calldata _username, string calldata _displayName, string calldata _avatarURI, string calldata _bannerURI",
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
      method: "function updateProfile(string calldata _displayName, string calldata _avatarURI, string calldata _bannerURI)",
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
      client: client,
      contract: dapperContract,
      method: "function createPost(string calldata _contentURI, bool _hasImage, uint256 _replyTo) external returns (uint256)",
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
      method: "function likePost(uint256 _postId)",
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
      method: "function unlikePost(uint256 _postId)",
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
      method: "function followUser(address _userToFollow)",
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
      method: "function unfollowUser(address _userToUnfollow)",
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
    method: "function getUserProfile(address _user) external view returns (Profile memory)",
    params: [address]
  });
  
  return { profile: data, isLoading, error };
}

export function useUserPosts(address) {
  const { data, isLoading: postsLoading, error: postsError } = useReadContract({
    contract: dapperContract,
    method: "function getUserPosts(address _user) external view returns (uint256[] memory)",
    params: [address]
  });
  
  return { postIds: data, postsLoading, postsError };
}

export function usePost(postId) {
  const { data, isLoading, error } = useReadContract({
    client: client,
    contract: dapperContract,
    method: "function getPost(uint256 _postId) external view returns (Post memory)",
    params: [postId]
  });
  
  return { post: data, isLoading, error };
}

export function useHasLiked(userAddress, postId) {
  const { data, isLoading, error } = useReadContract({
    contract: dapperContract,
    method: "function checkLiked(address _user, uint256 _postId) external view returns (bool)",
    params: [userAddress, postId]
  });
  
  return { hasLiked: data, isLoading, error };
}

export function useFollowers(address) {
  const { data, isLoading, error } = useReadContract({
    contract: dapperContract,
    method: "function getFollowers(address _user) external view returns (address[] memory)",
    params: [address]
  });
  
  return { followers: data, isLoading, error };
}

export function useFollowing(address) {
  const { data, isLoading, error } = useReadContract({
    contract: dapperContract,
    method: "function getFollowing(address _user) external view returns (address[] memory)",
    params: [address]
  });
  
  return { following: data, isLoading, error };
}

export function useIsFollowing(followerAddress, followedAddress) {
  const { data, isLoading, error } = useReadContract({
    contract: dapperContract,
    method: "function checkFollowing(address _follower, address _followed) external view returns (bool)",
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
    method: "function getReplies(uint256 _postId) external view returns (uint256[] memory)",
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
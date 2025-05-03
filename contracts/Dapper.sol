// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

contract DapperSocial {
    struct Post {
        uint256 id;
        address author;
        string contentURI; // IPFS URI
        uint256 timestamp;
        uint256 likeCount;
        bool hasImage;
        uint256 replyTo; // postId that this is replying to, else 0 if original post
        uint256 replyCount;
    }

    struct Profile {
        string username;
        string displayName;
        string avatarURI; // IPFS URI
        string bannerURI; // IPFS URI
        uint256 joinDate;
        uint256[] postIds;
    }

    event PostCreated(uint256 indexed postId, address indexed author, string contentURI, uint256 timestamp);
    event PostLiked(uint256 indexed postId, address indexed liker);
    event PostUnliked(uint256 indexed postId, address indexed unliker);
    event PostReplied(uint256 indexed postId, uint256 indexed replyId, address indexed replier);
    event ProfileUpdated(address indexed user, string username);
    event UserFollowed(address indexed follower, address indexed followed);
    event UserUnfollowed(address indexed follower, address indexed unfollowed);

    uint256 private _postIdCounter = 1;
    
    mapping(uint256 => Post) public posts;
    mapping(address => Profile) public profiles;
    mapping(address => mapping(address => bool)) public isFollowing;
    mapping(address => address[]) public following;
    mapping(address => address[]) public followers;
    mapping(address => mapping(uint256 => bool)) public hasLiked;
    mapping(address => uint256[]) private userLikedPosts;
    
    function createProfile(
        string calldata _username,
        string calldata _displayName,
        string calldata _avatarURI,
        string calldata _bannerURI
    ) external {
        require(bytes(profiles[msg.sender].username).length == 0, "Profile already exists");
        
        profiles[msg.sender] = Profile({
            username: _username,
            displayName: _displayName,
            avatarURI: _avatarURI,
            bannerURI: _bannerURI,
            joinDate: block.timestamp,
            postIds: new uint256[](0)
        });
        
        emit ProfileUpdated(msg.sender, _username);
    }
    
    function updateProfile(
        string calldata _displayName,
        string calldata _avatarURI,
        string calldata _bannerURI
    ) external {
        require(bytes(profiles[msg.sender].username).length > 0, "Profile doesn't exist");
        
        Profile storage profile = profiles[msg.sender];
        profile.displayName = _displayName;
        profile.avatarURI = _avatarURI;
        profile.bannerURI = _bannerURI;
        
        emit ProfileUpdated(msg.sender, profile.username);
    }
    
    function createPost(
        string calldata _contentURI, 
        bool _hasImage,
         uint256 _replyTo
    ) external returns (uint256) {
        require(bytes(profiles[msg.sender].username).length > 0, "Create a profile first");
        
        if (_replyTo != 0) {
            require(_replyTo < _postIdCounter && _replyTo > 0, "Original post doesn't exist");
            
            posts[_replyTo].replyCount++;
            
            emit PostReplied(_replyTo, _postIdCounter, msg.sender);
        }

        uint256 postId = _postIdCounter++;
        
        posts[postId] = Post({
            id: postId,
            author: msg.sender,
            contentURI: _contentURI,
            timestamp: block.timestamp,
            likeCount: 0,
            hasImage: _hasImage,
            replyTo: _replyTo,
            replyCount: 0
        });
        
        profiles[msg.sender].postIds.push(postId);
        
        emit PostCreated(postId, msg.sender, _contentURI, block.timestamp);
        
        return postId;
    }
    
    function likePost(uint256 _postId) external {
        require(_postId < _postIdCounter, "Post doesn't exist");
        require(!hasLiked[msg.sender][_postId], "Already liked this post");
        
        Post storage post = posts[_postId];
        post.likeCount++;
        hasLiked[msg.sender][_postId] = true;
        userLikedPosts[msg.sender].push(_postId);
        
        emit PostLiked(_postId, msg.sender);
    }
    
    function unlikePost(uint256 _postId) external {
        require(_postId < _postIdCounter, "Post doesn't exist");
        require(hasLiked[msg.sender][_postId], "Haven't liked this post");
        
        Post storage post = posts[_postId];
        post.likeCount--;
        hasLiked[msg.sender][_postId] = false;
        for (uint256 i = 0; i < userLikedPosts[msg.sender].length; i++) {
            if (userLikedPosts[msg.sender][i] == _postId) {
                // set i to last liked post and pop
                userLikedPosts[msg.sender][i] = userLikedPosts[msg.sender][userLikedPosts[msg.sender].length - 1];
                userLikedPosts[msg.sender].pop();
                break;
            }
        }

        emit PostUnliked(_postId, msg.sender);
    }
    
    function followUser(address _userToFollow) external {
        require(msg.sender != _userToFollow, "Cannot follow yourself");
        require(bytes(profiles[_userToFollow].username).length > 0, "User to follow doesn't exist");
        require(!isFollowing[msg.sender][_userToFollow], "Already following this user");
        
        isFollowing[msg.sender][_userToFollow] = true;
        following[msg.sender].push(_userToFollow);
        followers[_userToFollow].push(msg.sender);
        
        emit UserFollowed(msg.sender, _userToFollow);
    }
    
    function unfollowUser(address _userToUnfollow) external {
        require(isFollowing[msg.sender][_userToUnfollow], "Not following this user");
        
        isFollowing[msg.sender][_userToUnfollow] = false;
        
        address[] storage followingList = following[msg.sender];
        for (uint256 i = 0; i < followingList.length; i++) {
            if (followingList[i] == _userToUnfollow) {
                followingList[i] = followingList[followingList.length - 1];
                followingList.pop();
                break;
            }
        }
        
        address[] storage followersList = followers[_userToUnfollow];
        for (uint256 i = 0; i < followersList.length; i++) {
            if (followersList[i] == msg.sender) {
                followersList[i] = followersList[followersList.length - 1];
                followersList.pop();
                break;
            }
        }
        
        emit UserUnfollowed(msg.sender, _userToUnfollow);
    }
    
    function getUserProfile(address _user) external view returns (Profile memory) {
        return profiles[_user];
    }

    function getUserPosts(address _user) external view returns (uint256[] memory) {
        return profiles[_user].postIds;
    }
    
    function getPost(uint256 _postId) external view returns (Post memory) {
        require(_postId < _postIdCounter, "Post doesn't exist");
        return posts[_postId];
    }
    
    function getFollowers(address _user) external view returns (address[] memory) {
        return followers[_user];
    }
    
    function getFollowing(address _user) external view returns (address[] memory) {
        return following[_user];
    }
    
    function checkFollowing(address _follower, address _followed) external view returns (bool) {
        return isFollowing[_follower][_followed];
    }
    
    function checkLiked(address _user, uint256 _postId) external view returns (bool) {
        return hasLiked[_user][_postId];
    }

    function getReplies(uint256 _postId) external view returns (uint256[] memory) {
        require(_postId < _postIdCounter, "Post doesn't exist");
        
        uint256 replyCount = 0;
        for (uint256 i = 0; i < _postIdCounter; i++) {
            if (posts[i].replyTo == _postId) {
                replyCount++;
            }
        }
        
        uint256[] memory replies = new uint256[](replyCount);
        uint256 currentIndex = 0;
        
        for (uint256 i = 0; i < _postIdCounter; i++) {
            if (posts[i].replyTo == _postId) {
                replies[currentIndex] = i;
                currentIndex++;
            }
        }
        
        return replies;
    }

    function getBatchPosts(uint256[] calldata _postIds) external view returns (Post[] memory) {
        Post[] memory batchPosts = new Post[](_postIds.length);
        
        for (uint256 i = 0; i < _postIds.length; i++) {
            require(_postIds[i] < _postIdCounter, "post doesn't exist");
            batchPosts[i] = posts[_postIds[i]];
        }
        
        return batchPosts;
    }

    function retrieveRecentPosts(uint256 _stepIncrement, uint256 _count) external view returns (Post[] memory) {
        require(_postIdCounter > 1, "no posts exist");
        
        uint256 availablePosts = _postIdCounter - 1;
        require(_stepIncrement < availablePosts, "increment too large");
        
        uint256 postsToReturn = _count;
        if (_stepIncrement + postsToReturn > availablePosts) {
            postsToReturn = availablePosts - _stepIncrement;
        }
        
        Post[] memory result = new Post[](postsToReturn);
        
        for (uint256 i = 0; i < postsToReturn; i++) {
            uint256 postId = availablePosts - _stepIncrement - i;
            
            result[i] = posts[postId];
        }
        
        return result;
    }


    // the following are for profile page

    function getLikedPosts(address _user) external view returns (uint256[] memory) {
        return userLikedPosts[_user];
    }

    function getUserParentPosts(address _user) external view returns (uint256[] memory) {
        uint256[] memory userPosts = profiles[_user].postIds;
        uint256 parentCount = 0;
        
        for (uint256 i = 0; i < userPosts.length; i++) {
            if (posts[userPosts[i]].replyTo == 0) {
                parentCount++;
            }
        }
        
        uint256[] memory parentPosts = new uint256[](parentCount);
        uint256 currentI = 0;
        
        for (uint256 i = 0; i < userPosts.length; i++) {
            if (posts[userPosts[i]].replyTo == 0) {
                parentPosts[currentI] = userPosts[i];
                currentI++;
            }
        }
        
        return parentPosts;
    }

    function getUserReplies(address _user) external view returns (uint256[] memory) {
        uint256[] memory userPosts = profiles[_user].postIds;
        uint256 replyCount = 0;
        
        for (uint256 i = 0; i < userPosts.length; i++) {
            if (posts[userPosts[i]].replyTo != 0) {
                replyCount++;
            }
        }
        
        uint256[] memory replies = new uint256[](replyCount);
        uint256 currentI = 0;
        
        for (uint256 i = 0; i < userPosts.length; i++) {
            if (posts[userPosts[i]].replyTo != 0) {
                replies[currentI] = userPosts[i];
                currentI++;
            }
        }
        
        return replies;
    }
}
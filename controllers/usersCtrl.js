import UserModel from "../models/User.js";

//READ
export const getUser = async (req, res) => {
  const { id } = req.params;
  const user = await UserModel.findById(id);
  if (!user) {
    return res.status(404).json({ msg: "User not found." });
  }
  return res.status(200).json(user);
};

//READ
export const getUserFriends = async (req, res) => {
  const { id } = req.params;
  const user = await UserModel.findById(id);
  if (!user) {
    return res.status(404).json({ msg: "User not found." });
  }
  const friends = await Promise.all(
    user.friends.map((id) => UserModel.findById(id))
  );

  //preformat results from db calls
  const formattedFriends = friends.map(
    ({ _id, firstName, lastName, occupation, location, picturePath }) => {
      return { _id, firstName, lastName, occupation, location, picturePath };
    }
  );

  return res.status(200).json(formattedFriends);
};

//UPDATE
export const addRemoveFriend = async (req, res) => {
  const { id, friendId } = req.params;
  const user = await UserModel.findById(id);
  const friend = await UserModel.findById(friendId);
  if (!user || !friend) {
    return res.status(404).json({ msg: "User or friend not found." });
  }

  if (user.friends.includes(friendId)) {
    //remove friend from user's friends
    user.friends = user.friends.filter((id) => id !== friendId);
    //remove user from friend's friends
    friend.friends = friend.friends.filter((friendId) => friendId !== id);
  } else {
    //add friend to user's friends and vice versa
    user.friends.push(friendId);
    friend.friends.push(id);
  }

  await user.save();
  await friend.save();

  //send back formatted friends to the front-end
  const friends = await Promise.all(
    user.friends.map((id) => UserModel.findById(id))
  );
  const formattedFriends = friends.map(
    ({ _id, firstName, lastName, occupation, location, picturePath }) => {
      return {
        _id,
        firstName,
        lastName,
        occupation,
        location,
        picturePath,
      };
    }
  );

  return res.status(200).json(formattedFriends);
};

export const updateSocial = async (req, res) => {
  const { id } = req.params;
  const { network, handle } = req.body;

  const update = {};
  const networkToUpdate = network === "twitter" ? "twitter" : "linkedIn";

  update[networkToUpdate] = handle;
  const updatedUser = await UserModel.findByIdAndUpdate(id, update, {
    new: true,
  });
  return res.status(201).json(updatedUser);
};

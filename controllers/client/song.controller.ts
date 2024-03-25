import { Request, Response } from "express";
import Topic from "../../models/topic.model";
import Singer from "../../models/singer.model";
import Song from "../../models/song.model";
import FavoriteSong from "../../models/favourite-song.model";

// [GET] /songs/:slugTopic
export const list = async (req: Request, res: Response) => {
  const slugTopic: string = req.params.slugTopic;

  const topic = await Topic.findOne({
    slug: slugTopic,
    deleted: false,
    status: "active",
  });

  if (topic) {
    const songs = await Song.find({
      topicId: topic._id,
      deleted: false,
      status: "active",
    }).select("avatar title singerId like slug");

    for (const song of songs) {
      const infoSinger = await Singer.findOne({
        _id: song.singerId,
        deleted: false,
      });

      const favoriteSong = await FavoriteSong.findOne({
        userId: "",
        songId: song.id,
      });

      song["isFavoriteSong"] = favoriteSong ? true : false;

      song["infoSinger"] = infoSinger;
    }

    res.render("client/pages/songs/list.pug", {
      pageTitle: topic.title,
      songs: songs,
    });
  } else {
    res.redirect("/");
  }
};

// [GET] /songs/detail/:slugSong
export const detail = async (req: Request, res: Response): Promise<void> => {
  const slugSong: string = req.params.slugSong;
  const song = await Song.findOne({
    slug: slugSong,
    status: "active",
    deleted: false,
  });

  const singer = await Singer.findOne({
    _id: song.singerId,
    deleted: false,
  }).select("fullName");

  const topic = await Topic.findOne({
    _id: song.topicId,
    deleted: false,
  }).select("title");

  res.render("client/pages/songs/detail", {
    pageTitle: "Song detail",
    song: song,
    singer: singer,
    topic: topic,
  });
};

// [PATCH] /songs/like/:type/:idSong
export const like = async (req: Request, res: Response) => {
  const idSong: string = req.params.idSong;
  const type: string = req.params.type;

  const song = await Song.findOne({
    _id: idSong,
    deleted: false,
    status: "active",
  });

  let updateLike = song.like;

  if (type == "yes") {
    updateLike += 1;
  } else {
    updateLike -= 1;
  }

  await Song.updateOne(
    {
      _id: idSong,
    },
    {
      like: updateLike,
    }
  );

  res.json({
    code: 200,
    message: "Success!",
    like: updateLike,
  });
};

// [PATCH] /songs/favorite/:type/:idSong
export const favorite = async (req: Request, res: Response) => {
  const idSong: string = req.params.idSong;
  const type: string = req.params.type;

  if (type == "yes") {
    const existRecord = await FavoriteSong.findOne({
      userId: "",
      songId: idSong,
    });

    if (!existRecord) {
      const record = new FavoriteSong({
        userId: "",
        songId: idSong,
      });

      await record.save();
    }
  } else {
    await FavoriteSong.deleteOne({
      userId: "",
      songId: idSong,
    });
  }

  res.json({
    code: 200,
    message: "Success!",
  });
};

// [PATCH] /songs/listen/:idSong
export const listen = async (req: Request, res: Response) => {
  const idSong = req.params.idSong;

  const song = await Song.findOne({
    _id: idSong,
    deleted: false,
    status: "active",
  });

  const listen: number = song.listen + 1;

  await Song.updateOne(
    {
      _id: idSong,
    },
    {
      listen: listen,
    }
  );

  const songNew = await Song.findOne({
    _id: idSong,
  });

  res.json({
    code: 200,
    message: "success",
    listen: songNew.listen,
  });
};

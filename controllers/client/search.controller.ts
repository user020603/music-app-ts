import { Request, Response } from "express";
import Song from "../../models/song.model";
import Singer from "../../models/singer.model";
import { convertToSlug } from "../../helpers/convert-to-slug.helper";

// [get] /search/:type
export const result = async (req: Request, res: Response): Promise<void> => {
  const keyword: string = `${req.query.keyword}`;
  const type = req.params.type;
  let newSongs = [];
  if (keyword) {
    const keywordRegex = new RegExp(keyword, "i");
    // tạo slug không dấu có -
    const stringSlug = convertToSlug(keyword);
    const stringSlugRegex = new RegExp(stringSlug, "i");

    const songs = await Song.find({
      $or: [{ title: keywordRegex }, { slug: stringSlugRegex }],
    });
    for (const item of songs) {
      const infoSinger = await Singer.findOne({
        _id: item.singerId,
      });
      newSongs.push({
        id: item.id,
        title: item.title,
        avatar: item.avatar,
        like: item.like,
        slug: item.slug,
        infoSinger: {
          fullName: infoSinger.fullName,
        },
      });
    }
  }
  if (type == "result") {
    res.render("client/pages/search/result", {
      pageTitle: `Kết quả: ${keyword}`,
      keyword: keyword,
      songs: newSongs,
    });
  } else if (type == "suggest") {
    res.json({
      code: 200,
      message: "thanh cong",
      songs: newSongs,
    });
  }
};

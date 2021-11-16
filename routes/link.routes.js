import { Router } from "express";
import { nanoid } from 'nanoid'
import config from 'config';

import Link from "../models/Link.js";
import auth from "../middleware/auth.middleware.js";

const router = Router();

router.post('/generate', auth, async (req, res) => {
  try {
    const baseUrl = config.get('baseUrl');
    const { from } = req.body;

    const existing = await Link.findOne({ from });

    if (existing) {
      return res.json({ link: existing });
    }

    const code = nanoid();

    const to = `${baseUrl}t/${code}`;

    const link = new Link({
      from,
      to,
      code,
      owner: req.user.userId,
    });

    await link.save();

    res.status(201).json({ link });
  } catch (error) {
    res.status(500).json({
      message: 'Something went wrong. Please, try again.'
    });
  }
});

router.get('/', auth, async (req, res) => {
  try {
    const links = await Link.find({ owner: req.user.userId });
    res.json(links);
  } catch (error) {
    res.status(500).json({
      message: 'Something went wrong. Please, try again.'
    });
  }
});

router.get('/:id', auth, async (req, res) => {
  try {
    const link = await Link.findById(req.params.id);
    res.json(link);
  } catch (error) {
    res.status(500).json({
      message: 'Something went wrong. Please, try again.'
    });
  }
});

export default router;

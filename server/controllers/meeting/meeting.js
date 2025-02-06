const MeetingHistory = require('../../model/schema/meeting')
const mongoose = require('mongoose');

const add = async (req, res) => {
  const { agenda, attendes, attendesLead, dateTime, location, notes, related } = req.body;
  const createBy = new mongoose.Types.ObjectId(req.user.userId);
  try {
    const newMeeting = new MeetingHistory({
      agenda,
      attendes,
      attendesLead,
      dateTime,
      location,
      notes,
      related,
      createBy,
    });
    const savedMeeting = await newMeeting.save();
    res.status(201).json(savedMeeting);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

const index = async (_, res) => {
  try {
    const meetings = await MeetingHistory.find({ deleted: false }).populate({
      path: 'createBy',
      select: 'firstName lastName role',
    }).populate('attendes attendesLead');
    res.status(200).json(meetings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

const view = async (req, res) => {
  try {
    const meetingId = req.params.id;
    const meeting = await MeetingHistory.findOne({ _id: meetingId, deleted: false }).populate({
      path: 'createBy',
      select: 'firstName lastName role', // Include only name and role fields
    }).populate('attendes attendesLead');
    if (!meeting) {
      return res.status(404).json({ message: 'Meeting not found' });
    }
    res.status(200).json(meeting);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

const deleteData = async (req, res) => {
  try {
    const meetingId = req.params.id;
    const deletedMeeting = await MeetingHistory.findByIdAndUpdate(meetingId, { deleted: true }, { new: true });
    if (!deletedMeeting) {
      return res.status(404).json({ message: 'Meeting not found' });
    }
    res.status(200).json({ message: 'Meeting deleted successfully', deletedMeeting });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

const deleteMany = async (req, res) => {
  try {
    const ids = req.body;
    const result = await MeetingHistory.updateMany({ _id: { $in: ids } }, { deleted: true });
    if (result.nModified === 0) {
      return res.status(404).json({ message: 'No meetings found to delete' });
    }
    res.status(200).json({ message: 'Meetings deleted successfully', result });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

module.exports = { add, index, view, deleteData, deleteMany }
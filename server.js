// Import necessary libraries
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const next = require('next');
const nodemailer = require('nodemailer');

// -----------------------------------------------------------------------------
// 1. INITIAL SETUP
// -----------------------------------------------------------------------------

// Check if we are in development or production
const dev = process.env.NODE_ENV !== 'production';

// Initialize the Next.js app
const nextApp = next({ dev });
const nextHandler = nextApp.getRequestHandler();

// Get the port from the environment (for Render) or default to 3000 (for local)
const port = process.env.PORT || 3000;

// Get email credentials from environment variables
const EMAIL_USER = process.env.EMAIL_USER;
const EMAIL_PASS = process.env.EMAIL_PASS;

nextApp.prepare().then(() => {
  // ---------------------------------------------------------------------------
  // 2. CREATE SERVERS
  // ---------------------------------------------------------------------------

  // Create an Express app
  const app = express();
  // Create an HTTP server using the Express app
  const server = http.createServer(app);

  // Initialize Socket.io and attach it to the HTTP server
  // We must configure CORS to allow our frontend to connect
  const io = new Server(server, {
    cors: {
      origin: '*', // Allow connections from any origin (for simplicity)
      methods: ['GET', 'POST'],
    },
  });

  // ---------------------------------------------------------------------------
  // 3. NODEMAILER (EMAIL INVITE) API ENDPOINT
  // ---------------------------------------------------------------------------

  // Use Express's JSON middleware to parse request bodies
  app.use(express.json());

  // Create a POST endpoint for sending email invites
  app.post('/api/send-invite', async (req, res) => {
    const { email, url } = req.body;

    if (!email || !url) {
      return res.status(400).json({ error: 'Email and URL are required.' });
    }

    if (!EMAIL_USER || !EMAIL_PASS) {
      console.error('Email credentials (EMAIL_USER, EMAIL_PASS) are not set.');
      return res.status(500).json({ error: 'Server email is not configured.' });
    }

    // Configure the Nodemailer transporter (using Gmail)
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: EMAIL_USER,
        pass: EMAIL_PASS,
      },
    });

    // Email content
    const mailOptions = {
      from: EMAIL_USER,
      to: email,
      subject: 'Pixcel Coders - You are invited to a "Connect" session!',
      html: `
        <h1>You're Invited!</h1>
        <p>A user has invited you to a live pair-programming session.</p>
        <p>Click the link below to join:</p>
        <a href="${url}" style="padding: 10px 20px; background-color: #007bff; color: white; text-decoration: none; border-radius: 5px;">
          Join Session
        </a>
        <p>Or copy and paste this link into your browser:</p>
        <p>${url}</p>
      `,
    };

    // Send the email
    try {
      await transporter.sendMail(mailOptions);
      res.status(200).json({ success: true });
    } catch (error) {
      console.error('Error sending email:', error);
      res.status(500).json({ error: 'Failed to send email.' });
    }
  });

  // ---------------------------------------------------------------------------
  // 4. SOCKET.IO (WEBSOCKET) LOGIC
  // ---------------------------------------------------------------------------

  io.on('connection', (socket) => {
    console.log(`New connection: ${socket.id}`);

    // --- Room Logic ---
    socket.on('join-room', (roomId) => {
      socket.join(roomId);
      console.log(`User ${socket.id} joined room ${roomId}`);

      // Notify other user(s) in the room that a new user has joined
      // This is the first step of the WebRTC "handshake"
      const usersInRoom = Array.from(io.sockets.adapter.rooms.get(roomId) || []);
      const otherUsers = usersInRoom.filter((id) => id !== socket.id);

      if (otherUsers.length > 0) {
        // Tell the new user who the other user is
        socket.emit('other-user', otherUsers[0]);
        // Tell the other user who the new user is
        socket.to(otherUsers[0]).emit('user-joined', socket.id);
      }
    });

    // --- WebRTC Signaling Logic (for simple-peer) ---
    // A "caller" sends an "offer" to a "target"
    socket.on('offer', (payload) => {
      io.to(payload.target).emit('offer', {
        signal: payload.signal,
        callerID: socket.id,
      });
    });

    // A "receiver" sends an "answer" back to the "caller"
    socket.on('answer', (payload) => {
      io.to(payload.target).emit('answer', {
        signal: payload.signal,
        id: socket.id,
      });
    });

    // --- Live Code Sync Logic ---
    socket.on('code-change', (data) => {
      // Broadcast the code change to everyone else in the room
      socket.to(data.room).emit('code-change', data.code);
    });

    // --- Disconnect Logic ---
    socket.on('disconnect', () => {
      console.log(`User disconnected: ${socket.id}`);
      // In a real app, you'd emit this to the room to handle a user leaving
      // io.emit('user-disconnected', socket.id);
    });
  });

  // ---------------------------------------------------------------------------
  // 5. NEXT.JS REQUEST HANDLER
  // ---------------------------------------------------------------------------

  // This is the "catch-all" handler.
  // Any request that didn't match our '/api/send-invite' route
  // will be passed to Next.js to handle.
  // This is what makes your actual website pages load.
  app.all('*', (req, res) => {
    return nextHandler(req, res);
  });

  // ---------------------------------------------------------------------------
  // 6. START THE SERVER
  // ---------------------------------------------------------------------------

  server.listen(port, (err) => {
    if (err) throw err;
    console.log(`> Ready on http://localhost:${port}`);
  });
});
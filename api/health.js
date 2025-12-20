module.exports = async function handler(req, res) {
  if (req.method !== 'GET') {
    res.status(405).json({ status: 'error', error: 'Method Not Allowed' });
    return;
  }

  res.status(200).json({
    status: 'ok',
    timestamp: new Date().toISOString()
  });
};

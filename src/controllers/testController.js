function handleTest(req, res) {
    const data = req.body;
    console.log('Received data:', data);
    res.send('Data received successfully!');
}

module.exports = { handleTest };

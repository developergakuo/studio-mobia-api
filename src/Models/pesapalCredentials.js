const { Schema, model } = require("mongoose");

const pesapalCredentialsSchema = new Schema({
    ipnId: String,
});

pesapalCredentialsSchema.index({}, { unique: true });

exports.pesapalCredentialsModel = model("pesapalcredentials", pesapalCredentialsSchema);

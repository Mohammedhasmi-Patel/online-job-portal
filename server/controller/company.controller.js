import Company from "../models/company.model.js";

export const registerCompany = async (req, res) => {
  try {
    const { companyName } = req.body;

    if (!companyName) {
      return res
        .status(400)
        .json({ success: false, message: "Company name is required" });
    }

    let company = await Company.findOne({
      companyName,
    });

    if (company) {
      return res
        .status(400)
        .json({ success: false, message: "Company already exists" });
    }

    company = new Company({
      name: companyName,
      userId: req.id,
    });

    if (!company) {
      return res.status(400).json({
        success: false,
        message: "There is an error while registerting the company...",
      });
    }

    await company.save();
    res.status(201).json({
      success: true,
      message: "Company registered successfully",
      company,
    });
  } catch (error) {
    console.log(`error in registerCompany: ${error}`);
    res.status(500).json({ message: error.message });
  }
};

export const getCompany = async (req, res) => {
  try {
    const userId = req.id;

    const company = await Company.find({ userId });
    if (!company) {
      return res
        .status(404)
        .json({ success: false, message: "Company not found" });
    }

    res.status(200).json({ success: true, company });
  } catch (error) {
    console.log(`error in getCompany: ${error}`);
    res.status(500).json({ message: error.message });
  }
};

export const getCompanyById = async (req, res) => {
  try {
    const companyId = req.params.id;
    const company = await Company.findById(companyId);
    if (!company) {
      return res
        .status(404)
        .json({ success: false, message: "Company not found" });
    }

    res.status(200).json({ success: true, company });
  } catch (error) {
    console.log(`error in getCompanyById: ${error}`);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateCompany = async (req, res) => {
  try {
    const { name, description, website, location } = req.body;
    const file = req.file;

    const updateData = { name, description, website, location };

    const company = await Company.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
    });

    if (!company) {
      return res.status(400).json({
        success: false,
        message: "There is an error while updating the company...",
      });
    }

    res.status(200).json({
      success: true,
      message: "Company Data Updated Successfully.....",
      company,
    });
  } catch (error) {
    console.log(`error in updateCompany: ${error}`);
    res.status(500).json({ message: error.message });
  }
};

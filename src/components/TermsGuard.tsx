import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import TermsModal from "@/components/TermsModal";
import { fetchTermsVersion, isTermsAccepted } from "@/lib/terms";

/**
 * Garde globale qui exige l’acceptation des Conditions

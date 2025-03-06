import Image from "next/image";
import styles from "./page.module.css";
import Login from "@/components/Login";
import HomePage from "@/components/HomePage";
import 'bootstrap/dist/css/bootstrap.min.css';
import DashBoard from "@/components/DashBoard";

export default function Home() {
  return (
    <>
    <HomePage />
    </>
  );
}

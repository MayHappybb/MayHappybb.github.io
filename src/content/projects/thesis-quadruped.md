---
title: "Whole-body planning for a quadruped with an arm"
summary: "My undergraduate thesis. Plan the legs and the arm of an 18-DoF robot as one system, and it needs half the joint effort."
year: '2022'
date: 2022-06-10
group: early
icon: arm
built: "My own work (C++, Eigen, CppAD, Ipopt, ROS, Gazebo)."
links:
  - label: ROBIO 2022 paper
    href: https://doi.org/10.1109/ROBIO55434.2022.10011971
  - label: Robotica 2023 paper
    href: https://doi.org/10.1017/S0263574723000371
---

Advisor: Prof. Wenfu Xu, Harbin Institute of Technology, Shenzhen. Defended 10 June 2022.

A quadruped walks to a work site and then uses its 6-DoF arm. Usually the arm is planned on its own while the body stands still. But the body can help: lean, shift, lower. I modelled robot and arm as one 18-DoF system (kinematics, statics with gravity, simplified rigid-body dynamics) and posed the arm's move to a goal as a nonlinear program: minimise the integral of the squared joint torques, subject to kinematic, friction and balance constraints. The body and arm paths are pre-shaped as quintic curves so the solver (Ipopt, with CppAD for derivatives) finishes in about two minutes.

In Gazebo, with the lab robot's real parameters, the integrated squared torque of whole-body planning was **half** that of planning body and arm separately. The work went into a ROBIO 2022 paper and a Robotica 2023 paper, both as second author.

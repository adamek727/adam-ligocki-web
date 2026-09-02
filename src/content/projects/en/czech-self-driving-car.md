---
title: The first Czech self-driving car
description: A car that learns a route from a single human-driven pass, then drives it alone.
client: RoboAuto (ARTIN Group)
role: Sensor fusion, computer vision, C++
period: 2017 — 2023
outcome: Built on sensors costing tens of thousands of crowns instead of a 1.8M CZK LiDAR
stack: [C++, LiDAR, Sensor fusion, Computer vision]
tags: [robotics, autonomous-driving, c++]
order: 2
---

A human drives the route once, the car stores the map, and afterwards it repeats
the route with nobody at the wheel. Built at RoboAuto together with researchers
from Brno University of Technology, and demonstrated publicly.

The interesting constraint was money. The reference sensor for this problem cost
about 1.8 million crowns at the time. The team chose sensors costing tens of
thousands instead and closed the gap in software, which is where I worked:
fusing cheap, noisy sensors into one model of the road good enough to drive on.

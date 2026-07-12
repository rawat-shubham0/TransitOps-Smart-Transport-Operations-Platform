# 🚚 TransitOps – Smart Transport Operations Platform

> Product Requirements Document (PRD)

TransitOps – Smart Transport Operations Platform

## 1.0

8 Hours

## 1. Product Overview

TransitOps is a centralized transport management platform designed to digitize fleet operations for logistics and transportation companies. The platform helps organizations manage vehicles, drivers, trips, maintenance activities, fuel consumption, and operational expenses from a single dashboard.
The goal is to eliminate manual spreadsheets and paper logs while improving operational efficiency, visibility, and decision-making.

## 2. Problem Statement

Many transport and logistics companies still rely on spreadsheets and manual record keeping to manage vehicles, drivers, and deliveries.
This creates several challenges:
Vehicle scheduling conflicts
Driver assignment errors
Missed maintenance schedules
Expired driving licenses
Poor fuel tracking
Inaccurate expense records
Lack of operational insights
TransitOps addresses these issues through a centralized digital platform.

## 3. Objectives


### Primary Objectives

Digitize fleet management operations
Improve vehicle and driver utilization
Track trips efficiently
Monitor fuel and maintenance costs
Generate operational reports and analytics
Success Metrics
100% digital vehicle records
Accurate trip assignments
Reduced scheduling conflicts
Real-time operational visibility
Automated status management

## 4. Target Users

Fleet Manager
Responsibilities:
Manage vehicles
Track maintenance
Monitor fleet utilization
View operational reports
Dispatcher
Responsibilities:
Create trips
Assign vehicles
Assign drivers
Monitor trip status
Safety Officer
Responsibilities:
Monitor license validity
Review driver safety scores
Ensure compliance
Financial Analyst
Responsibilities:
Analyze expenses
Monitor fuel consumption
Track maintenance costs
Review profitability

## 5. User Roles & Permissions


## 6. Functional Requirements

Module 1: Authentication
Features
User Login
Secure Password Authentication
Role-Based Access Control (RBAC)
Session Management
Fields
Email
Password
Role
Module 2: Dashboard
KPI Cards
Total Vehicles
Active Vehicles
Vehicles in Maintenance
Available Vehicles
Active Trips
Pending Trips
Drivers On Duty
Fleet Utilization %
Dashboard Charts
Trip Status Distribution
Fuel Cost Analysis
Maintenance Cost Trend
Vehicle Utilization Chart
Module 3: Vehicle Management
Vehicle Fields
Registration Number
Vehicle Name
Vehicle Model
Vehicle Type
Maximum Load Capacity
Odometer Reading
Acquisition Cost
Status
Status Values
Available
On Trip
In Shop
Retired
Features
Add Vehicle
Edit Vehicle
Delete Vehicle
Search Vehicle
Filter Vehicle
Module 4: Driver Management
Driver Fields
Driver Name
License Number
License Category
License Expiry Date
Contact Number
Safety Score
Status
Status Values
Available
On Trip
Off Duty
Suspended
Features
Add Driver
Update Driver
Delete Driver
License Validation
Driver Availability Tracking
Module 5: Trip Management
Trip Fields
Source
Destination
Vehicle
Driver
Cargo Weight
Planned Distance
Start Date
End Date
Trip Lifecycle
Draft → Dispatched → Completed → Cancelled
Features
Create Trip
Assign Driver
Assign Vehicle
Dispatch Trip
Complete Trip
Cancel Trip
Module 6: Maintenance Management
Maintenance Fields
Vehicle
Maintenance Type
Description
Cost
Start Date
Completion Date
Features
Create Maintenance Request
Update Maintenance Status
Complete Maintenance
Vehicle Status Automation
Module 7: Fuel Management
Fuel Log Fields
Vehicle
Fuel Quantity (Liters)
Fuel Cost
Date
Features
Add Fuel Entry
Fuel History
Fuel Efficiency Calculation
Module 8: Expense Management
Expense Types
Fuel
Toll Charges
Maintenance
Miscellaneous
Features
Add Expense
Expense Categorization
Cost Analysis
Module 9: Reports & Analytics
Reports
Fleet Utilization Report
Fuel Consumption Report
Vehicle Performance Report
Driver Performance Report
Maintenance Cost Report
Analytics
Fuel Efficiency
Operational Cost
Vehicle ROI
Cost Per Kilometer

## 7. Business Rules

Vehicle Rules
Registration Number must be unique.
Retired vehicles cannot be dispatched.
Vehicles under maintenance cannot be assigned to trips.
Driver Rules
Expired license drivers cannot be assigned.
Suspended drivers cannot be assigned.
Drivers already on a trip cannot be reassigned.
Trip Rules
Cargo weight cannot exceed vehicle capacity.
Vehicle and Driver become "On Trip" when dispatched.
Vehicle and Driver become "Available" when trip is completed.
Cancellation restores availability.
Maintenance Rules
Vehicle automatically becomes "In Shop" when maintenance starts.
Vehicle becomes "Available" after maintenance completion.

## 8. Database Entities

Users
user_id
name
email
password
role
Vehicles
vehicle_id
registration_number
vehicle_name
vehicle_type
max_capacity
odometer
acquisition_cost
status
Drivers
driver_id
name
license_number
expiry_date
safety_score
status
Trips
trip_id
vehicle_id
driver_id
source
destination
cargo_weight
distance
status
Maintenance
maintenance_id
vehicle_id
description
cost
status
Fuel Logs
fuel_log_id
vehicle_id
liters
cost
date
Expenses
expense_id
vehicle_id
expense_type
amount
date

## 9. Non-Functional Requirements

Performance
Dashboard load < 3 seconds
API response < 500 ms
Security
Password Encryption
JWT Authentication
Role-Based Access
Usability
Mobile Responsive
User-Friendly Interface
Simple Navigation

## 10. Tech Stack

Frontend
React.js
Tailwind CSS
Recharts
Axios
React Router DOM
Backend
Python Django
Django REST Framework (DRF)
JWT Authentication (Simple JWT)
Django ORM
Database
MySQL
Deployment
Frontend
Vercel
Backend
Render / Railway
Database
MySQL Cloud Database
Development Tools
Postman (API Testing)
Git & GitHub (Version Control)
VS Code
Figma (UI Design)
Excalidraw (System Design & Workflow Diagrams)

## 11. Future Enhancements

GPS Vehicle Tracking
Live Map Integration
Email Alerts
SMS Notifications
Predictive Maintenance
AI-Based Route Optimization
Mobile Application

## 12. Hackathon MVP Scope

Must Have
Authentication
Dashboard
Vehicle CRUD
Driver CRUD
Trip Management
Maintenance Module
Fuel Tracking
Analytics Dashboard
Nice To Have
PDF Export
Email Reminders
Dark Mode
Vehicle Documents Upload